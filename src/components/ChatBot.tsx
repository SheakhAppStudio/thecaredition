"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isValidUKRegistration } from '@/services/vehicleApi';

// Types for our chatbot
interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  options?: string[];
}

interface ChatBotProps {
  onClose: () => void;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  carRegistration: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  engineSize: string;
  query: string;
}

// Google Apps Script URL - using the exact same one as the service estimator
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgO6NKDDGYqwj6qWrpzQRnuz3CKgmdYQEfDyk3oiCzguKrwisG0louyp6XvOoah3IAgg/exec';

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    carRegistration: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    engineSize: '',
    query: ''
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat steps - more human-like conversation flow
  const chatSteps = [
    { 
      message: "👋 Hi there! I'm Sarah from The Car Edition. How can I help you today?",
      options: ["Service Booking", "Get a Quote", "Ask a Question"]
    },
    { message: "Great choice! I'd love to help you with that. First, could I get your name please?" },
    { message: "Nice to meet you! I'll need a few details to help you better. Could you share your email address?" },
    { message: "Perfect, thanks! Now I'll need your phone number so our team can reach you." },
    { message: "Almost there! Could you please enter your car registration number? (e.g., AB12 CDE)" },
    { message: "Thanks! I'll check that registration for you..." },
    { message: "Now, could you tell me what specific services you're interested in? For example: MOT, Service, Repairs, etc." },
    { message: "Thanks for all that information! Is there anything else you'd like to add about your request? Any specific issues with your car or preferred appointment times?" },
    { message: "Great! I've submitted your information to our team. Someone will contact you shortly on the phone number you provided. Is there anything else I can help with today?" }
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start the chat with initial greeting only once when component mounts
  useEffect(() => {
    // Only add the initial message if there are no messages yet
    if (messages.length === 0) {
      // Use a timeout to ensure this only happens once after the component is fully mounted
      const timer = setTimeout(() => {
        addBotMessage(chatSteps[0].message, chatSteps[0].options);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Add a bot message with typing effect
  const addBotMessage = (text: string, options?: string[]) => {
    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text,
        sender: 'bot',
        options
      }]);
      setIsTyping(false);
    }, 1000);
  };

  // Add a user message
  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text,
      sender: 'user'
    }]);
  };

  // Handle user input submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    addUserMessage(inputValue);
    
    // Process the user input based on current step
    processUserInput(inputValue);
    
    // Clear input
    setInputValue('');
  };

  // Process user input based on current step
  const processUserInput = async (input: string) => {
    const newData = { ...customerData };
    
    switch (currentStep) {
      case 0: // Initial option selection
        setCurrentStep(1);
        addBotMessage(chatSteps[1].message);
        break;
      
      case 1: // Name
        newData.name = input;
        setCustomerData(newData);
        setCurrentStep(2);
        addBotMessage(chatSteps[2].message);
        break;
      
      case 2: // Email
        if (!isValidEmail(input)) {
          addBotMessage("That doesn't look like a valid email address. Could you please try again?");
          return;
        }
        newData.email = input;
        setCustomerData(newData);
        setCurrentStep(3);
        addBotMessage(chatSteps[3].message);
        break;
      
      case 3: // Phone
        if (!isValidPhone(input)) {
          addBotMessage("That doesn't look like a valid UK phone number. Could you please try again?");
          return;
        }
        newData.phone = input;
        setCustomerData(newData);
        setCurrentStep(4);
        addBotMessage(chatSteps[4].message);
        break;
      
      case 4: // Car registration
        if (!isValidRegistration(input)) {
          addBotMessage("That doesn't look like a valid UK registration number. Please enter in the format AB12 CDE.");
          return;
        }
        newData.carRegistration = input.toUpperCase();
        setCustomerData(newData);
        setCurrentStep(5);
        addBotMessage(chatSteps[5].message);
        
        // Verify registration with DVSA API - more human-like responses
        try {
          setIsTyping(true);
          const vehicleData = await fetchVehicleData(input);
          setIsTyping(false);
          
          if (vehicleData) {
            newData.vehicleMake = vehicleData.make;
            newData.vehicleModel = vehicleData.model || '';
            newData.vehicleYear = vehicleData.yearOfManufacture;
            newData.engineSize = vehicleData.engineCapacity ? `${vehicleData.engineCapacity}cc` : '';
            setCustomerData(newData);
            
            addBotMessage(`Great! I've found your ${vehicleData.color} ${vehicleData.make} from ${vehicleData.yearOfManufacture}${vehicleData.engineCapacity ? `, with a ${vehicleData.engineCapacity}cc ${vehicleData.fuelType} engine` : ''}. Is this correct?`, ["Yes, that's my car", "No, that's not right"]);
            setCurrentStep(6);
          } else {
            addBotMessage("I couldn't find details for that registration number in our system. No worries though! Let's continue with your inquiry. What services are you interested in?");
            setCurrentStep(6);
          }
        } catch (error) {
          console.error("Error fetching vehicle data:", error);
          addBotMessage("Sorry, I'm having trouble checking that registration number right now. Let's continue anyway. What services are you interested in?");
          setCurrentStep(6);
        }
        break;
      
      case 5: // Vehicle verification confirmation
        if (input.toLowerCase().includes('yes')) {
          setCurrentStep(6);
          addBotMessage(chatSteps[6].message);
        } else {
          addBotMessage("No problem at all! Let me get those details from you instead. What make is your vehicle? (For example: Ford, BMW, Toyota, etc.)");
          setCurrentStep(5.1);
        }
        break;
      
      case 5.1: // Manual vehicle make
        newData.vehicleMake = input;
        setCustomerData(newData);
        addBotMessage("Thanks! And what year was your vehicle manufactured? Just the year is fine.");
        setCurrentStep(5.2);
        break;
      
      case 5.2: // Manual vehicle year
        newData.vehicleYear = input;
        setCustomerData(newData);
        addBotMessage("Almost done with the vehicle details! If you know your engine size, please tell me (e.g., 1.6L, 2000cc). If not, just type 'unknown'.");
        setCurrentStep(5.3);
        break;
      
      case 5.3: // Manual engine size
        newData.engineSize = input === 'unknown' ? '' : input;
        setCustomerData(newData);
        setCurrentStep(6);
        addBotMessage("Thanks for providing those details! " + chatSteps[6].message);
        break;
      
      case 6: // Services interested in
        newData.query = input;
        setCustomerData(newData);
        setCurrentStep(7);
        addBotMessage(chatSteps[7].message);
        break;
      
      case 7: // Additional notes
          // Submit the data directly to Google Apps Script using a hidden form and iframe
          try {
            setIsTyping(true);
            
            // Create a form that submits to the hidden iframe
            if (formRef.current) {
              // Set the form properties
              formRef.current.action = GOOGLE_SCRIPT_URL;
              formRef.current.method = 'POST';
              formRef.current.target = 'hidden-iframe'; // Submit to the iframe to prevent page redirect
              
              // Clear any existing hidden inputs
              while (formRef.current.firstChild) {
                formRef.current.removeChild(formRef.current.firstChild);
              }
              
              // Create hidden input fields exactly matching the service estimator form
              const addHiddenField = (name: string, value: string) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                formRef.current?.appendChild(input);
              };
              
              // Add all the required fields exactly as they appear in the service estimator
              addHiddenField('timestamp', new Date().toISOString());
              addHiddenField('name', newData.name);
              addHiddenField('email', newData.email);
              addHiddenField('phone', newData.phone);
              addHiddenField('carRegistration', newData.carRegistration);
              addHiddenField('vehicleMake', newData.vehicleMake || '');
              addHiddenField('vehicleModel', newData.vehicleModel || '');
              addHiddenField('vehicleYear', newData.vehicleYear || '');
              addHiddenField('selectedServices', newData.query); // Use the query field for services
              addHiddenField('totalPrice', '0'); // No price calculation in chatbot
              addHiddenField('notes', input || 'Inquiry from chat'); // Additional notes
              
              // Submit the form to the hidden iframe
              formRef.current.submit();
            }
          
          setIsTyping(false);
          setCurrentStep(8);
          addBotMessage(chatSteps[8].message, ["Yes", "No, thank you"]);
        } catch (error) {
          setIsTyping(false);
          console.error("Error submitting data:", error);
          addBotMessage("I'm sorry, there was an error submitting your information. Please try again later or contact us directly.");
        }
        break;
      
      case 8: // Final step
        if (input.toLowerCase().includes('yes')) {
          // Reset to beginning
          setCurrentStep(0);
          setCustomerData({
            name: '',
            email: '',
            phone: '',
            carRegistration: '',
            vehicleMake: '',
            vehicleModel: '',
            vehicleYear: '',
            engineSize: '',
            query: '',
          });
          addBotMessage("Great! Let's start fresh. " + chatSteps[0].message, chatSteps[0].options);
        } else {
          addBotMessage("Thank you for chatting with me today! Our team will be in touch with you shortly on the phone number you provided. Have a wonderful day!");
          // Close chat after a delay
          setTimeout(() => {
            onClose();
          }, 5000);
        }
        break;
      
      default:
        break;
    }
  };

  // Handle option click
  const handleOptionClick = (option: string) => {
    addUserMessage(option);
    processUserInput(option);
  };

  // Validation functions
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^(\+44|0)[0-9]{10,11}$/.test(phone.replace(/\s/g, ''));
  };

  const isValidRegistration = (reg: string) => {
    // Use the same validation function as the service estimator
    return isValidUKRegistration(reg);
  };

  // Fetch vehicle data from DVSA API
  const fetchVehicleData = async (registration: string) => {
    try {
      const response = await fetch(`/api/vehicle-lookup?registration=${registration}`);
      if (!response.ok) {
        throw new Error('Failed to fetch vehicle data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      return null;
    }
  };

  // Reset chat when needed
  const resetChat = () => {
    setMessages([]);
    setCurrentStep(0);
    setCustomerData({
      name: '',
      email: '',
      phone: '',
      carRegistration: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      engineSize: '',
      query: '',
    });
  };
  
  // Chat is initialized in the useEffect when component mounts

  return (
    <>
      {/* Hidden iframe to prevent page redirect */}
      <iframe name="hidden-iframe" style={{display: 'none'}} ref={iframeRef}></iframe>
      
      {/* Hidden form for submissions */}
      <form ref={formRef} style={{display: 'none'}}></form>

      {/* Chat window */}
      <AnimatePresence>
        {(
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-6 w-80 sm:w-96 h-[500px] bg-gray-900 rounded-lg shadow-xl overflow-hidden z-50 border border-gray-700"
          >
            {/* Chat header */}
            <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
              <div className="flex items-center">
                <div className="bg-orange-500 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold">The Car Edition Chat</h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat messages */}
            <div className="p-4 h-[380px] overflow-y-auto bg-gray-900">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 ${message.sender === 'bot' ? 'text-left' : 'text-right'}`}
                  >
                    <div
                      className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                        message.sender === 'bot'
                          ? 'bg-gray-800 text-white'
                          : 'bg-orange-500 text-white'
                      }`}
                    >
                      {message.text}
                    </div>
                    
                    {/* Options buttons */}
                    {message.sender === 'bot' && message.options && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            className="bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-full px-3 py-1 transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center space-x-1 mb-4">
                  <div className="bg-gray-800 rounded-full h-2 w-2 animate-pulse"></div>
                  <div className="bg-gray-800 rounded-full h-2 w-2 animate-pulse delay-100"></div>
                  <div className="bg-gray-800 rounded-full h-2 w-2 animate-pulse delay-200"></div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border-t border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-2 focus:outline-none"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-r-lg px-4 py-2 transition-colors"
                  disabled={isTyping || !inputValue.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

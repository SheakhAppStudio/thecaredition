"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

// Google Apps Script Web App URL - Replace with your deployed script URL when ready
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
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
    query: '',
  });
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat steps
  const chatSteps = [
    { 
      message: "👋 Hello! Welcome to The Car Edition. I'm your virtual assistant. How can I help you today?",
      options: ["Service Booking", "Get a Quote", "Ask a Question"]
    },
    { message: "Great! Could you please tell me your name?" },
    { message: "Nice to meet you! Could you please provide your email address?" },
    { message: "Thanks! Now, could you share your phone number?" },
    { message: "Now, could you please enter your car registration number? (e.g., AB12 CDE)" },
    { message: "Thanks! I'll verify that registration..." },
    { message: "Could you please tell me what services you're interested in?" },
    { message: "Thank you for all the information! Is there anything specific you'd like to mention about your request?" },
    { message: "Thank you! Your information has been submitted. One of our customer service representatives will contact you shortly. Is there anything else I can help you with?" }
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start the chat with initial greeting when isOpen changes
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(chatSteps[0].message, chatSteps[0].options);
    }
  }, [isOpen]);

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
        
        // Verify registration with DVSA API
        try {
          setIsTyping(true);
          const vehicleData = await fetchVehicleData(input);
          setIsTyping(false);
          
          if (vehicleData) {
            newData.vehicleMake = vehicleData.make;
            newData.vehicleYear = vehicleData.yearOfManufacture;
            newData.engineSize = vehicleData.engineSize;
            setCustomerData(newData);
            
            addBotMessage(`I've found your vehicle: ${vehicleData.make} (${vehicleData.yearOfManufacture}), ${vehicleData.engineSize} engine. Is this correct?`, ["Yes", "No"]);
            setCurrentStep(6);
          } else {
            addBotMessage("I couldn't verify that registration. Let's continue anyway. What services are you interested in?");
            setCurrentStep(6);
          }
        } catch (error) {
          console.error("Error fetching vehicle data:", error);
          addBotMessage("I couldn't verify that registration. Let's continue anyway. What services are you interested in?");
          setCurrentStep(6);
        }
        break;
      
      case 5: // Vehicle verification confirmation
        if (input.toLowerCase() === 'yes' || input.toLowerCase() === 'y') {
          setCurrentStep(6);
          addBotMessage(chatSteps[6].message);
        } else {
          addBotMessage("No problem. Could you please tell me your vehicle make?");
          setCurrentStep(5.1);
        }
        break;
      
      case 5.1: // Manual vehicle make
        newData.vehicleMake = input;
        setCustomerData(newData);
        addBotMessage("And what year was your vehicle manufactured?");
        setCurrentStep(5.2);
        break;
      
      case 5.2: // Manual vehicle year
        newData.vehicleYear = input;
        setCustomerData(newData);
        addBotMessage("What is your engine size (if you know it)?");
        setCurrentStep(5.3);
        break;
      
      case 5.3: // Manual engine size
        newData.engineSize = input;
        setCustomerData(newData);
        setCurrentStep(6);
        addBotMessage(chatSteps[6].message);
        break;
      
      case 6: // Services interested in
        newData.query = input;
        setCustomerData(newData);
        setCurrentStep(7);
        addBotMessage(chatSteps[7].message);
        break;
      
      case 7: // Additional notes
        // Submit the data directly to Google Apps Script
        try {
          setIsTyping(true);
          const formData = new FormData();
          formData.append('data', JSON.stringify({
            name: newData.name,
            email: newData.email,
            phone: newData.phone,
            carRegistration: newData.carRegistration,
            vehicleMake: newData.vehicleMake || '',
            vehicleModel: newData.vehicleModel || '',
            vehicleYear: newData.vehicleYear || '',
            engineSize: newData.engineSize || '',
            query: newData.query + " | Additional notes: " + input
          }));
          
          // Send data to Google Apps Script
          const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors', // This is important for CORS issues with Google Apps Script
            redirect: 'follow'
          });
          
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
          addBotMessage(chatSteps[0].message, chatSteps[0].options);
        } else {
          addBotMessage("Thank you for chatting with us today! Feel free to come back if you have any more questions. Have a great day!");
          // Close chat after a delay
          setTimeout(() => {
            setIsOpen(false);
          }, 3000);
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
    // Basic UK registration format check
    return /^[A-Z0-9]{2,4}\s?[A-Z0-9]{3}$/i.test(reg);
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
  };
  
  // Initialize chat when component mounts
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(chatSteps[0].message, chatSteps[0].options);
    }
  }, []);

  return (
    <>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
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

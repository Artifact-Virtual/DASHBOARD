import { useState, useEffect, useRef, useCallback } from 'react';

const useWebSocket = (url = 'ws://localhost:8000/ws', options = {}) => {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const optionsRef = useRef(options);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const connect = useCallback(() => {
    try {
      console.log(`Connecting to WebSocket at ${url}...`);
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected successfully');
        setConnected(true);
        setError(null);
        if (optionsRef.current.onOpen) {
          optionsRef.current.onOpen();
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        if (optionsRef.current.onClose) {
          optionsRef.current.onClose();
        }
        
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          console.log('📥 Data received:', newData);
          
          // Skip heartbeat messages
          if (newData.type !== 'heartbeat') {
            setData(newData);
            if (optionsRef.current.onMessage) {
              optionsRef.current.onMessage(newData);
            }
          }
        } catch (err) {
          console.error('❌ Error parsing WebSocket data:', err);
          setError('Invalid data received from server');
          if (optionsRef.current.onError) {
            optionsRef.current.onError(err);
          }
        }
      };

      wsRef.current.onerror = (err) => {
        console.error('❌ WebSocket error:', err);
        setError('Connection failed');
        setConnected(false);
        if (optionsRef.current.onError) {
          optionsRef.current.onError(err);
        }
      };
    } catch (err) {
      console.error('❌ WebSocket connection error:', err);
      setError(err.message);
      setConnected(false);
      if (optionsRef.current.onError) {
        optionsRef.current.onError(err);
      }
    }
  }, [url]);

  // Send message function
  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
        console.log('📤 Message sent:', message);
      } catch (err) {
        console.error('❌ Error sending message:', err);
        setError('Failed to send message');
      }
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message');
      setError('Not connected to server');
    }
  }, []);

  // Connect on mount, cleanup on unmount
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { 
    data, 
    connected, 
    error, 
    sendMessage,
    connect
  };
};

export default useWebSocket;

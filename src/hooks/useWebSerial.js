/**
 * Web Serial Hook for Arduino Communication
 * Manages serial port connection and data transmission
 */

import { useState, useCallback } from 'react';

/**
 * Custom hook for Web Serial API communication with Arduino
 * @returns {Object} Serial connection state and control functions
 */
export function useWebSerial() {
  const [isConnected, setIsConnected] = useState(false);
  const [port, setPort] = useState(null);
  const [writer, setWriter] = useState(null);
  const [lastSent, setLastSent] = useState('');
  const [error, setError] = useState(null);
  const [isSupported] = useState('serial' in navigator);

  /**
   * Connect to serial port
   */
  const connect = useCallback(async () => {
    if (!isSupported) {
      setError('Web Serial API is not supported in this browser. Use Chrome or Edge.');
      return false;
    }

    try {
      setError(null);
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 92600 });
      
      const writerStream = selectedPort.writable.getWriter();
      
      setPort(selectedPort);
      setWriter(writerStream);
      setIsConnected(true);
      
      return true;
    } catch (err) {
      console.error('Serial connection error:', err);
      setError('Failed to connect. Check cable and permissions.');
      setIsConnected(false);
      return false;
    }
  }, [isSupported]);

  /**
   * Disconnect from serial port
   */
  const disconnect = useCallback(async () => {
    try {
      if (writer) {
        await writer.releaseLock();
        setWriter(null);
      }
      if (port) {
        await port.close();
        setPort(null);
      }
    } catch (err) {
      console.error('Disconnect error:', err);
    } finally {
      setIsConnected(false);
    }
  }, [port, writer]);

  /**
   * Send a single character to Arduino
   * @param {string} letter - Single ASCII character to send
   */
  const sendLetter = useCallback(async (letter) => {
    if (!isConnected || !writer) {
      console.warn('Cannot send: not connected');
      return false;
    }

    try {
      await writer.write(new TextEncoder().encode(letter));
      setLastSent(letter);
      return true;
    } catch (err) {
      console.error('Send error:', err);
      setError('Send failed. Connection lost.');
      await disconnect();
      return false;
    }
  }, [isConnected, writer, disconnect]);

  return {
    isConnected,
    isSupported,
    lastSent,
    error,
    connect,
    disconnect,
    sendLetter
  };
}

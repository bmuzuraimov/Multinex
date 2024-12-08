import useLocalStorage from './useLocalStorage';

export default function useKeyboard() {
  const [keyboardVisible, setKeyboardVisible] = useLocalStorage('keyboard-visible', false);
  
  const toggleKeyboard = () => {
    setKeyboardVisible(!keyboardVisible);
  };

  return [keyboardVisible, setKeyboardVisible, toggleKeyboard] as const;
}

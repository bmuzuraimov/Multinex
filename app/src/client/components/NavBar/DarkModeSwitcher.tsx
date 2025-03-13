import useColorMode from '../../hooks/useColorMode';
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

const DarkModeSwitcher = () => {
  const [color_mode, set_color_mode] = useColorMode();

  const handleColorModeToggle = () => {
    if (typeof set_color_mode === 'function') {
      set_color_mode(color_mode === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <button
      onClick={handleColorModeToggle}
      className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
      aria-label="Toggle dark mode"
    >
      {color_mode === 'light' ? (
        <MdOutlineDarkMode className="w-5 h-5 text-gray-600" />
      ) : (
        <MdOutlineLightMode className="w-5 h-5 text-gray-300" />
      )}
    </button>
  );
};

export default DarkModeSwitcher;

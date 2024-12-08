import useColorMode from '../hooks/useColorMode';
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <button
      onClick={() => {
        if (typeof setColorMode === 'function') {
          setColorMode(colorMode === 'light' ? 'dark' : 'light');
        }
      }}
      className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
      aria-label="Toggle dark mode"
    >
      {colorMode === 'light' ? (
        <MdOutlineDarkMode className="w-5 h-5 text-gray-600" />
      ) : (
        <MdOutlineLightMode className="w-5 h-5 text-gray-300" />
      )}
    </button>
  );
};

export default DarkModeSwitcher;

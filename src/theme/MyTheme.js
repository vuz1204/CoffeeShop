import React, {createContext, useState, useContext} from 'react';

// b1. Khởi tạo context cho theme
const themeContext = createContext();
// Nơi sử dụng sẽ dùng cấu trúc <MyTheme>......</MyTheme>
// Phần ...... là thuộc tính children
// Có export;

export const MyTheme = ({children}) => {
  // b2. Tạo state để lưu trạng thái đang sử dụng mẫu theme nào
  const [theme, setTheme] = useState('light'); // VD 2 dạng: sáng/tối (light/dark)

  // Viết hàm chuyển mẫu giao diện
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <themeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </themeContext.Provider>
  );
};

// định nghĩa một hàm hook
export const useTheme = () => useContext(themeContext);

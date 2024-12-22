import { useState } from "react";
//导入文件
import theme_image1 from "../assets/theme1-0.jpg";
import theme_image2 from "../assets/theme2-1.jpg";
import theme_image3 from "../assets/theme2-2.jpg";

const Themes = () => {
  //定义主题的图片数组，实际中可以放到某个文件中统一存放
  const images = [theme_image1, theme_image2, theme_image3];
  const [theme, setTheme] = useState(0);
  const [focus, setFocus] = useState(false);
  //从localstorage中获取主题
  const storage_theme = parseInt(localStorage.getItem("theme") || "0");
  const [apply_theme, setApplyTheme] = useState(storage_theme);

  const handleImageClick = (index: number) => {
    setTheme(index);
    setFocus(true);
  };

  const handleApply = () => {
    //暂时存放到localstroage中,如果要实际应用，可以发送请求到后端
    localStorage.setItem("theme", theme.toString());
    //切换实际显示的主题
    setApplyTheme(theme);
  };

  return (
    <div className="container flex flex-col py-8 px-4 mx-auto w-7/12">
      <div className="use_theme flex flex-row p-10 border-b border-gray-300">
        <img
          src={images[apply_theme]}
          alt="theme_image1"
          className="h-auto w-56"
        />
        <div className="theme_info py-4 px-8 flex flex-col items-start space-y-2">
          <h2 className="text-gray-500 font-bold">MyTheme</h2>
          <h2 className="text-black font-bold">Theme 1</h2>
          <button className="bg-orange-500 text-white px-4 py-2 mt-8">
            Customize
          </button>
        </div>
      </div>
      <div className="other_theme py-8 px-4">
        <h2 className="text-black font-bold text-2xl">Other Themes</h2>
        <div className="theme_choose_container flex flex-row my-4">
          {focus && (
            <div className="theme_info w-3/4 p-2">
              <img
                src={images[theme]}
                alt="theme_image2"
                className="w-auto h-auto"
              />
              <div className="flex flex-row p-2 items-center space-x-4 justify-end">
                <h2 className="text-gray-500 font-bold">Theme 2</h2>
                <button
                  className="bg-orange-500 text-white px-4 py-2"
                  onClick={() => handleApply()}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
          <div
            className={`theme_img_container flex flex-row justify-between 
          ${focus ? "w-2/3 h-2/3" : "w-full"}`}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`theme_image${index + 1}`}
                className="w-1/3 h-auto p-2 "
                onClick={() => handleImageClick(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Themes;

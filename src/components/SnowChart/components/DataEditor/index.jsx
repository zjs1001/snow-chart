import { useMemo } from "react";
import { Slider, InputNumber } from "antd";

const DataEditor = ({ data, updateData }) => {
  
  const list = useMemo(() => {
    return data.map((item) => {
      return {
        name: item.name,
        label: item.label,
        value: item.value,
      };
    });
  }, [data]);
  const onChange = (value, item) => {
    updateData(item.name, value);
  };
  return (
    <div className="DataEditor-container bg-linear-to-br from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border-2 border-primary-300 dark:border-primary-700">
      <div className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">调整维度分数</div>
      <div className="DataEditor">
        {list.map((item, index) => {
          return (
            <div className="DataEditor-item" key={index}>
              <div className="header flex justify-between items-center mb-1.5">
                <label className="font-semibold text-sm text-gray-800 dark:text-white">{item.label}</label>
                <InputNumber
                  min={0}
                  max={7}
                  value={item.value}
                  onChange={(e) => onChange(e, item)}
                />
              </div>

              <Slider
                max={7}
                value={item.value}
                tooltip={{ formatter: null }}
                onChange={(e) => onChange(e, item)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataEditor;

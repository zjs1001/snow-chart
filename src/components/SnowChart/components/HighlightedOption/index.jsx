import { Radio, Flex } from "antd";
import "./index.less";

import { useMemo } from "react";
const HighlightedOption = ({ data, updateHighlight }) => {
  const btnList = useMemo(() => {
    const defaultBtn = {
      name: "",
      value: -1,
      // className:"w-full h-full flex items-center justify-start css-3xcgk",
      // label:'NONE'
      label: (
        <Flex gap="small" justify="center" align="center" vertical>
          NONE
        </Flex>
      ),
    };
    let dataBtn = data.data.map((item,index) => {
      return {
        name: item.name,
        value: index,
        // className:"w-full h-full flex items-center justify-start css-3xcgk",
        label: (
          <Flex gap="small" justify="center" align="center" vertical>
            {item.label}
          </Flex>
        ),
      };
    });
    return [defaultBtn, ...dataBtn];
  }, [data]);
  return (
    <div>
      <div className="highlightedOption from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border-2 border-primary-300 dark:border-primary-700 mt-3">
        <div className="highlightedOption-title text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          选择高亮区域
        </div>
        <div className="highlightedOption-content">
          <Radio.Group
            value={data.highlightIndex}
            size="large"
            options={btnList}
            onChange={(e) => updateHighlight("highlight", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default HighlightedOption;

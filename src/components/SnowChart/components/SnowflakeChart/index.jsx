import React, { useEffect, useMemo, useRef, useState } from "react";
import "./index.css";
const SnowflakeChart = ({ data }) => {
  const svgRef = useRef(null);
  const [highlightedSector, setHighlightedSector] = useState(-1);
  const highlightIndex = useMemo(() => data.highlightIndex, [data]);
  const snowData = useMemo(() => {
    return data.data.map((item) => {
      return {
        name: item.name,
        value: item.value,
        section: [true, true, true, true, true, true],
        description: item.description,
      };
    });
  }, [data]);

  useEffect(() => {
    //维度
    const axesCount = snowData.length;
    const svgElement = svgRef.current;
    // 在 useEffect 中添加数据归一化处理
    const maxRadius = 120; // 图表最大半径
    const chartMaxValue = 7;
    const maxSum = axesCount * chartMaxValue;
    const sumData = snowData
      .map((item) => item.value)
      .reduce((sum, value) => sum + value, 0);
    if (!svgElement) return;

    // 清除之前的内容
    while (svgElement.firstChild) {
      svgElement.removeChild(svgElement.firstChild);
    }

    const width = svgElement.clientWidth || 600;
    const height = svgElement.clientHeight || 600;
    const centerX = width / 2;
    const centerY = height / 2;

    const radiusList = [120, 100, 80, 60, 40, 20];
    const labels = snowData.map((item) => item.name);

    // 绘制网格
    const drawGrid = () => {
      // 绘制同心圆
      const colors = ["#2D3642", "#424B58"]; // 定义交替颜色
      radiusList.forEach((radius, index) => {
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", centerX);
        circle.setAttribute("cy", centerY);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", colors[index % colors.length]); // 交替填充颜色
        circle.setAttribute("stroke", "#4B5460");
        circle.setAttribute("stroke-width", "1");
        svgElement.appendChild(circle);
      });

      // 绘制轴线
      for (let i = 0; i < axesCount; i++) {
        const angle = (i * 2 * Math.PI) / axesCount - Math.PI / 2;
        const endX = centerX + Math.cos(angle) * 120;
        const endY = centerY + Math.sin(angle) * 120;
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", centerX);
        line.setAttribute("y1", centerY);
        line.setAttribute("x2", endX);
        line.setAttribute("y2", endY);
        line.setAttribute("stroke", "#424B58");
        line.setAttribute("stroke-width", "4");
        svgElement.appendChild(line);
      }

      // 在绘制轴线之后添加扇形区域
      for (let i = 0; i < axesCount; i++) {
        const startAngle = (i * 2 * Math.PI) / axesCount - Math.PI / 2;
        const endAngle = ((i + 1) * 2 * Math.PI) / axesCount - Math.PI / 2;

        // 创建扇形路径
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );

        // 计算扇形路径
        const outerRadius = 120;
        const innerRadius = 0;

        const startX1 = centerX + Math.cos(startAngle) * innerRadius;
        const startY1 = centerY + Math.sin(startAngle) * innerRadius;
        const endX1 = centerX + Math.cos(startAngle) * outerRadius;
        const endY1 = centerY + Math.sin(startAngle) * outerRadius;
        const endX2 = centerX + Math.cos(endAngle) * outerRadius;
        const endY2 = centerY + Math.sin(endAngle) * outerRadius;
        const startX2 = centerX + Math.cos(endAngle) * innerRadius;
        const startY2 = centerY + Math.sin(endAngle) * innerRadius;

        const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

        const pathData = `
          M ${startX1} ${startY1}
          L ${endX1} ${endY1}
          A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endX2} ${endY2}
          L ${startX2} ${startY2}
          A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startX1} ${startY1}
          Z
        `;
        path.setAttribute("d", pathData);

        // 设置高亮颜色 - 区分外部高亮和鼠标悬停
        const isHighlighted =
          highlightIndex !== -1
            ? highlightIndex === i
            : highlightedSector === i;
        path.setAttribute(
          "fill",
          isHighlighted ? "rgba(255, 215, 0, 0.3)" : "transparent"
        );
        path.setAttribute("data-index", i);
        path.setAttribute("class", "sector-area");
        path.setAttribute("style", "cursor: pointer;z-index: 9");

        if (highlightIndex === -1) {
          // 添加鼠标事件
          path.addEventListener("mouseenter", function () {
            setHighlightedSector(i);
          });

          path.addEventListener("mouseleave", function () {
            setHighlightedSector(-1);
          });
        }

        svgElement.appendChild(path);
      }
    };

    // 绘制数据
    const drawData = () => {
      const points = [];
      // 计算数据点坐标
      for (let i = 0; i < axesCount; i++) {
        const angle = (i * 2 * Math.PI) / axesCount - Math.PI / 2;
        const value = snowData[i].value || 0;
        const normalizedRadius = (value / chartMaxValue) * maxRadius;

        const x = centerX + Math.cos(angle) * normalizedRadius;
        const y = centerY + Math.sin(angle) * normalizedRadius;
        points.push({ x, y, value, angle, normalizedRadius });
      }

      // 检查是否所有数据都达到最大值
      const isAllMax = points.every((point) => point.value === chartMaxValue);
      const hue = Math.min(120, (sumData / maxSum) * 120);
      if (isAllMax) {
        // 当所有数据都达到最大值时，绘制正圆
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", centerX);
        circle.setAttribute("cy", centerY);
        circle.setAttribute("r", maxRadius);
        circle.setAttribute("fill", `hsl(${hue}, 80%, 50%, 0.7)`);
        circle.setAttribute("stroke", "#2D3642");
        circle.setAttribute("stroke-width", "2");
        svgElement.appendChild(circle);
      } else {
        // 使用三次贝塞尔曲线绘制平滑路径
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );

        let pathData = "";
        if (points.length > 0) {
          // 移动到第一个点
          pathData += `M ${points[0].x} ${points[0].y} `;
          // 为每个线段创建三次贝塞尔曲线
          for (let i = 0; i < axesCount; i++) {
            const currentPoint = points[i]; // 当前点
            const nextPoint = points[(i + 1) % axesCount]; // 获取下一个点
            const nextNextPoint = points[(i + 2) % axesCount]; // 获取下一个点的下一个点

            // 计算控制点1（当前点的切线方向）
            const prevPoint = points[(i - 1 + axesCount) % axesCount]; // 获取前一个点
            const tangent1X = nextPoint.x - prevPoint.x; // 计算下一点和 前一个点的切线向量
            const tangent1Y = nextPoint.y - prevPoint.y; // 计算下一点和 前一个点的切线向量
            const control1X = currentPoint.x + tangent1X * 0.25; // 计算当前点的切线向量,作为 控制点1的 x坐标
            const control1Y = currentPoint.y + tangent1Y * 0.25; // 计算当前点的切线向量，作为 控制点1的 y坐标

            // 计算控制点2（下一点的切线方向）
            const nextPrevPoint = points[(i + 0 + axesCount) % axesCount];
            const tangent2X = nextNextPoint.x - nextPrevPoint.x;
            const tangent2Y = nextNextPoint.y - nextPrevPoint.y;
            const control2X = nextPoint.x - tangent2X * 0.25;
            const control2Y = nextPoint.y - tangent2Y * 0.25;

            // 使用三次贝塞尔曲线连接点
            pathData += `C ${control1X} ${control1Y} ${control2X} ${control2Y} ${nextPoint.x} ${nextPoint.y} `;
          }

          pathData += "Z"; // 闭合路径
        }

        // 设置路径属性
        path.setAttribute("d", pathData);
        path.setAttribute("fill", `hsl(${hue}, 80%, 50%, 0.7)`);
        path.setAttribute("stroke", "#2D3642");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("stroke-linejoin", "round");
        svgElement.appendChild(path);
      }
    };

    // 绘制标签
    const drawLabels = () => {
      const labelRadius = 140 * 1.1;

      for (let i = 0; i < axesCount; i++) {
        const angle = (i * 2 * Math.PI) / axesCount - Math.PI / 2; // 角度：0-360度， 减去90度，使第一个标签在正上方
        const x = centerX + Math.cos(angle) * labelRadius; // Math.cos(angle): 计算角度对应的弧度, 弧度 = 角度 * π / 180; x坐标： x = 中心点x + cos(角度) * 半径;
        const y = centerY + Math.sin(angle) * labelRadius; // Math.sin(angle):  计算角度对应的弧度, 弧度 = 角度 * π / 180; y坐标： y = 中心点y + sin(角度) * 半径;

        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("fill", "#FFFFFF");
        text.setAttribute("font-size", "12px");
        text.textContent = labels[i];
        svgElement.appendChild(text);
      }
    };
    drawGrid();
    drawData();
    drawLabels();
  }, [highlightIndex, highlightedSector, snowData]);

  return (
    <div className="graph-container">
      <svg
        id="ringSvg"
        width="400"
        height="400"
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  );
};

export default SnowflakeChart;

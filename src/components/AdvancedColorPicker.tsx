import { useState, useEffect } from 'react';
import { Palette, Layers, Eye } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

interface ColorPreset {
  name: string;
  colors: string[];
}

const COLOR_PRESETS: ColorPreset[] = [
  {
    name: '基础色',
    colors: [
      '#7c3aed', '#eab308', '#1e40af', '#059669', '#dc2626', '#ea580c',
      '#0891b2', '#be185d', '#7c2d12', '#166534', '#1e3a8a', '#581c87'
    ]
  },
  {
    name: '暖色调',
    colors: [
      '#fef3c7', '#fde68a', '#f59e0b', '#d97706', '#92400e', '#78350f',
      '#fecaca', '#fca5a5', '#ef4444', '#dc2626', '#991b1b', '#7f1d1d'
    ]
  },
  {
    name: '冷色调',
    colors: [
      '#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a',
      '#d1fae5', '#a7f3d0', '#10b981', '#059669', '#047857', '#065f46'
    ]
  },
  {
    name: '中性色',
    colors: [
      '#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280',
      '#4b5563', '#374151', '#1f2937', '#111827', '#0f172a', '#020617'
    ]
  }
];

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
  'linear-gradient(135deg, #ff8a80 0%, #ea6100 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
];

export function AdvancedColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [activeTab, setActiveTab] = useState<'solid' | 'gradient' | 'advanced'>('solid');
  const [opacity, setOpacity] = useState(1);
  const [showOpacity, setShowOpacity] = useState(false);
  const [customColor, setCustomColor] = useState('#7c3aed');

  useEffect(() => {
    // 解析当前颜色值
    if (value.startsWith('linear-gradient')) {
      setActiveTab('gradient');
    } else if (value.startsWith('rgba')) {
      setActiveTab('advanced');
      const rgbaMatch = value.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      if (rgbaMatch) {
        const [, r, g, b, a] = rgbaMatch;
        setCustomColor(`#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`);
        setOpacity(parseFloat(a));
        setShowOpacity(true);
      }
    } else if (value.startsWith('#')) {
      setActiveTab('solid');
      setCustomColor(value);
    }
  }, [value]);

  const handleAdvancedColorChange = (color: string) => {
    const finalColor = `rgba(${hexToRgb(color)}, ${opacity})`;
    onChange(finalColor);
  };

  const handleSolidColorChange = (color: string) => {
    const finalColor = showOpacity ? `rgba(${hexToRgb(color)}, ${opacity})` : color;
    onChange(finalColor);
  };

  const handleGradientChange = (gradient: string) => {
    onChange(gradient);
  };

  const handleOpacityChange = (newOpacity: number) => {
    setOpacity(newOpacity);
    if (activeTab === 'solid') {
      const finalColor = showOpacity ? `rgba(${hexToRgb(customColor)}, ${newOpacity})` : customColor;
      onChange(finalColor);
    } else if (activeTab === 'advanced') {
      const finalColor = `rgba(${hexToRgb(customColor)}, ${newOpacity})`;
      onChange(finalColor);
    }
  };

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `${r}, ${g}, ${b}`;
    }
    return '0, 0, 0';
  };

  return (
    <div className="advanced-color-picker">
      {label && <h3>{label}</h3>}
      
      {/* 标签页 */}
      <div className="color-tabs">
        <button
          className={`color-tab ${activeTab === 'solid' ? 'active' : ''}`}
          onClick={() => setActiveTab('solid')}
        >
          <Palette size={16} />
          纯色
        </button>
        <button
          className={`color-tab ${activeTab === 'gradient' ? 'active' : ''}`}
          onClick={() => setActiveTab('gradient')}
        >
          <Layers size={16} />
          渐变
        </button>
        <button
          className={`color-tab ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          <Eye size={16} />
          高级
        </button>
      </div>

      {/* 纯色选择 */}
      {activeTab === 'solid' && (
        <div className="solid-color-section">
          {/* 自定义颜色选择器 */}
          <div className="custom-color">
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                handleSolidColorChange(e.target.value);
              }}
              className="color-input"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                handleSolidColorChange(e.target.value);
              }}
              className="color-text-input"
              placeholder="#7c3aed"
            />
          </div>

          {/* 预设颜色 */}
          {COLOR_PRESETS.map((preset) => (
            <div key={preset.name} className="color-preset-group">
              <h4>{preset.name}</h4>
              <div className="color-preset-grid">
                {preset.colors.map((color) => (
                  <div
                    key={color}
                    className="color-preset"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setCustomColor(color);
                      handleSolidColorChange(color);
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* 透明度控制 */}
          <div className="opacity-control">
            <div className="opacity-header">
              <label>
                <input
                  type="checkbox"
                  checked={showOpacity}
                  onChange={(e) => setShowOpacity(e.target.checked)}
                />
                启用透明度
              </label>
            </div>
            {showOpacity && (
              <div className="opacity-slider">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                  className="opacity-range"
                />
                <span className="opacity-value">{Math.round(opacity * 100)}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 渐变选择 */}
      {activeTab === 'gradient' && (
        <div className="gradient-section">
          <div className="gradient-grid">
            {GRADIENT_PRESETS.map((gradient, index) => (
              <div
                key={index}
                className="gradient-preset"
                style={{ background: gradient }}
                onClick={() => handleGradientChange(gradient)}
                title={gradient}
              />
            ))}
          </div>
        </div>
      )}

      {/* 高级设置 */}
      {activeTab === 'advanced' && (
        <div className="advanced-section">
          <div className="custom-color">
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                handleAdvancedColorChange(e.target.value);
              }}
              className="color-input"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                handleAdvancedColorChange(e.target.value);
              }}
              className="color-text-input"
              placeholder="#7c3aed"
            />
          </div>
          
          <div className="opacity-control">
            <div className="opacity-header">
              <label>透明度</label>
            </div>
            <div className="opacity-slider">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                className="opacity-range"
              />
              <span className="opacity-value">{Math.round(opacity * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 预览 */}
      <div className="color-preview">
        <div
          className="preview-box"
          style={{ background: value }}
        >
          <span className="preview-text">预览</span>
        </div>
      </div>
    </div>
  );
}

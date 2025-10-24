import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Palette, Image, RotateCcw } from 'lucide-react';

interface BackgroundSettings {
  running: {
    type: 'color' | 'image';
    color: string;
    image: string | null;
  };
  paused: {
    type: 'color' | 'image';
    color: string;
    image: string | null;
  };
}

const DEFAULT_BACKGROUNDS: BackgroundSettings = {
  running: {
    type: 'color',
    color: '#7c3aed', // 紫色
    image: null,
  },
  paused: {
    type: 'color',
    color: '#eab308', // 黄色
    image: null,
  },
};

interface SettingsProps {
  onSettingsChange?: (settings: BackgroundSettings) => void;
}

export function Settings({ onSettingsChange }: SettingsProps) {
  const [tempSettings, setTempSettings] = useState<BackgroundSettings>(DEFAULT_BACKGROUNDS);
  const [activeTab, setActiveTab] = useState<'running' | 'paused'>('running');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('timer-background-settings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        const loadedSettings = { ...DEFAULT_BACKGROUNDS, ...parsedSettings };
        setTempSettings(loadedSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = (newSettings: BackgroundSettings) => {
    try {
      localStorage.setItem('timer-background-settings', JSON.stringify(newSettings));
      setTempSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const applySettings = () => {
    saveSettings(tempSettings);
    // 通知父组件更新背景设置
    if (onSettingsChange) {
      onSettingsChange(tempSettings);
    }
    alert('设置已保存！');
  };

  const handleColorChange = (state: 'running' | 'paused', color: string) => {
    const newTempSettings = {
      ...tempSettings,
      [state]: {
        ...tempSettings[state],
        type: 'color' as const,
        color,
      },
    };
    setTempSettings(newTempSettings);
  };

  const handleImageUpload = (state: 'running' | 'paused', file: File) => {
    // 检查文件大小 (限制为2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB，请选择更小的图片');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      
      // 压缩图片
      compressImage(imageData, (compressedData) => {
        const newTempSettings = {
          ...tempSettings,
          [state]: {
            ...tempSettings[state],
            type: 'image' as const,
            image: compressedData,
          },
        };
        setTempSettings(newTempSettings);
      });
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (imageData: string, callback: (compressedData: string) => void) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 设置压缩后的尺寸 (最大800x600)
      const maxWidth = 800;
      const maxHeight = 600;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // 压缩质量设置为0.7
        const compressedData = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedData);
      }
    };
    img.src = imageData;
  };

  const resetToDefault = () => {
    setTempSettings(DEFAULT_BACKGROUNDS);
  };

  const currentSettings = tempSettings[activeTab];

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>
          <SettingsIcon size={24} />
          设置
        </h2>
        <p>自定义计时器背景颜色和图片</p>
      </div>

      <div className="settings-content">
        {/* 状态选择标签 */}
        <div className="state-tabs">
          <button
            className={`state-tab ${activeTab === 'running' ? 'active' : ''}`}
            onClick={() => setActiveTab('running')}
          >
            运行中背景
          </button>
          <button
            className={`state-tab ${activeTab === 'paused' ? 'active' : ''}`}
            onClick={() => setActiveTab('paused')}
          >
            暂停背景
          </button>
        </div>

        {/* 背景预览 */}
        <div className="background-preview">
          <h3>预览效果</h3>
          <div
            className="preview-box"
            style={{
              backgroundColor: currentSettings.type === 'color' ? currentSettings.color : undefined,
              backgroundImage: currentSettings.type === 'image' ? `url(${currentSettings.image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="preview-text">
              {activeTab === 'running' ? '运行中' : '暂停中'}
            </div>
          </div>
        </div>

        {/* 背景类型选择 */}
        <div className="background-type">
          <h3>背景类型</h3>
          <div className="type-options">
            <label className="type-option">
              <input
                type="radio"
                name="backgroundType"
                checked={currentSettings.type === 'color'}
                onChange={() => {
                  const newTempSettings = {
                    ...tempSettings,
                    [activeTab]: {
                      ...tempSettings[activeTab],
                      type: 'color' as const,
                    },
                  };
                  setTempSettings(newTempSettings);
                }}
              />
              <Palette size={20} />
              纯色背景
            </label>
            <label className="type-option">
              <input
                type="radio"
                name="backgroundType"
                checked={currentSettings.type === 'image'}
                onChange={() => {
                  const newTempSettings = {
                    ...tempSettings,
                    [activeTab]: {
                      ...tempSettings[activeTab],
                      type: 'image' as const,
                    },
                  };
                  setTempSettings(newTempSettings);
                }}
              />
              <Image size={20} />
              图片背景
            </label>
          </div>
        </div>

        {/* 颜色选择器 */}
        {currentSettings.type === 'color' && (
          <div className="color-picker">
            <h3>选择颜色</h3>
            <div className="color-options">
              <input
                type="color"
                value={currentSettings.color}
                onChange={(e) => handleColorChange(activeTab, e.target.value)}
                className="color-input"
              />
              <div className="preset-colors">
                <div
                  className="preset-color"
                  style={{ backgroundColor: '#7c3aed' }}
                  onClick={() => handleColorChange(activeTab, '#7c3aed')}
                  title="紫色"
                />
                <div
                  className="preset-color"
                  style={{ backgroundColor: '#eab308' }}
                  onClick={() => handleColorChange(activeTab, '#eab308')}
                  title="黄色"
                />
                <div
                  className="preset-color"
                  style={{ backgroundColor: '#1e40af' }}
                  onClick={() => handleColorChange(activeTab, '#1e40af')}
                  title="蓝色"
                />
                <div
                  className="preset-color"
                  style={{ backgroundColor: '#059669' }}
                  onClick={() => handleColorChange(activeTab, '#059669')}
                  title="绿色"
                />
                <div
                  className="preset-color"
                  style={{ backgroundColor: '#dc2626' }}
                  onClick={() => handleColorChange(activeTab, '#dc2626')}
                  title="红色"
                />
                <div
                  className="preset-color"
                  style={{ backgroundColor: '#ea580c' }}
                  onClick={() => handleColorChange(activeTab, '#ea580c')}
                  title="橙色"
                />
              </div>
            </div>
          </div>
        )}

        {/* 图片上传 */}
        {currentSettings.type === 'image' && (
          <div className="image-upload">
            <h3>上传图片</h3>
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(activeTab, file);
                  }
                }}
                className="file-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-button">
                <Image size={24} />
                选择图片
              </label>
              {currentSettings.image && (
                <div className="current-image">
                  <img src={currentSettings.image} alt="Current background" />
                  <button
                    className="remove-image"
                    onClick={() => {
                      const newTempSettings = {
                        ...tempSettings,
                        [activeTab]: {
                          ...tempSettings[activeTab],
                          image: null,
                        },
                      };
                      setTempSettings(newTempSettings);
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 重置按钮 */}
        <div className="settings-actions">
          <button className="btn btn-secondary" onClick={resetToDefault}>
            <RotateCcw size={16} />
            重置为默认
          </button>
          <button className="btn btn-primary" onClick={applySettings}>
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Download,
  QrCode,
  Link2,
  Mail,
  Phone,
  Wifi,
  MapPin,
  CreditCard,
  MessageSquare,
  User,
} from "lucide-react";

type QRType =
  | "text"
  | "url"
  | "email"
  | "phone"
  | "wifi"
  | "location"
  | "vcard"
  | "sms";

interface WiFiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
}

export default function Home() {
  const [qrType, setQrType] = useState<QRType>("text");
  const [qrValue, setQrValue] = useState("");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");

  // WiFi specific states
  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: "",
    password: "",
    encryption: "WPA",
  });

  // VCard specific states
  const [vcardData, setVcardData] = useState({
    name: "",
    phone: "",
    email: "",
    organization: "",
  });

  const qrRef = useRef<HTMLDivElement>(null);

  const getQRValue = () => {
    switch (qrType) {
      case "email":
        return `mailto:${qrValue}`;
      case "phone":
        return `tel:${qrValue}`;
      case "url":
        return qrValue.startsWith("http") ? qrValue : `https://${qrValue}`;
      case "wifi":
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`;
      case "location":
        return qrValue.startsWith("geo:") ? qrValue : `geo:${qrValue}`;
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardData.name}\nTEL:${vcardData.phone}\nEMAIL:${vcardData.email}\nORG:${vcardData.organization}\nEND:VCARD`;
      case "sms":
        return `sms:${qrValue}`;
      default:
        return qrValue;
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = url;
      link.click();
    }
  };

  const downloadSVG = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
          <rect width="100%" height="100%" fill="${bgColor}"/>
          <image href="${canvas.toDataURL()}" width="${size}" height="${size}"/>
        </svg>
      `;
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "qrcode.svg";
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const qrTypes = [
    { value: "text", label: "Văn bản", icon: QrCode },
    { value: "url", label: "Website URL", icon: Link2 },
    { value: "email", label: "Email", icon: Mail },
    { value: "phone", label: "Số điện thoại", icon: Phone },
    { value: "wifi", label: "WiFi", icon: Wifi },
    { value: "location", label: "Vị trí", icon: MapPin },
    { value: "vcard", label: "Danh thiếp", icon: User },
    { value: "sms", label: "SMS", icon: MessageSquare },
  ];

  const renderInputField = () => {
    switch (qrType) {
      case "wifi":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên WiFi (SSID)
              </label>
              <input
                type="text"
                value={wifiData.ssid}
                onChange={(e) =>
                  setWifiData({ ...wifiData, ssid: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nhập tên WiFi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="text"
                value={wifiData.password}
                onChange={(e) =>
                  setWifiData({ ...wifiData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nhập mật khẩu WiFi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại bảo mật
              </label>
              <select
                value={wifiData.encryption}
                onChange={(e) =>
                  setWifiData({
                    ...wifiData,
                    encryption: e.target.value as "WPA" | "WEP" | "nopass",
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Không mật khẩu</option>
              </select>
            </div>
          </div>
        );
      case "vcard":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                value={vcardData.name}
                onChange={(e) =>
                  setVcardData({ ...vcardData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={vcardData.phone}
                onChange={(e) =>
                  setVcardData({ ...vcardData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+84 123 456 789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={vcardData.email}
                onChange={(e) =>
                  setVcardData({ ...vcardData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Công ty/Tổ chức
              </label>
              <input
                type="text"
                value={vcardData.organization}
                onChange={(e) =>
                  setVcardData({ ...vcardData, organization: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tên công ty"
              />
            </div>
          </div>
        );
      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {qrType === "email" && "Địa chỉ Email"}
              {qrType === "phone" && "Số điện thoại"}
              {qrType === "url" && "URL Website"}
              {qrType === "location" && "Tọa độ (vd: 10.762622,106.660172)"}
              {qrType === "sms" && "Số điện thoại"}
              {qrType === "text" && "Nội dung văn bản"}
            </label>
            <textarea
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              rows={qrType === "text" ? 4 : 2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder={
                qrType === "email"
                  ? "example@email.com"
                  : qrType === "phone"
                  ? "+84 123 456 789"
                  : qrType === "url"
                  ? "https://example.com"
                  : qrType === "location"
                  ? "10.762622,106.660172"
                  : qrType === "sms"
                  ? "+84 123 456 789"
                  : "Nhập nội dung..."
              }
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-bg text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center flex items-center justify-center gap-3">
            <QrCode size={40} />
            Tạo Mã QR
          </h1>
          <p className="text-center mt-2 text-gray-100">
            Công cụ tạo mã QR chuyên nghiệp - Miễn phí và dễ sử dụng
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tùy chỉnh mã QR
              </h2>

              {/* QR Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Loại mã QR
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {qrTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => {
                          setQrType(type.value as QRType);
                          setQrValue("");
                        }}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                          qrType === type.value
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-sm font-medium">
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Field */}
              <div className="mb-6">{renderInputField()}</div>

              {/* Size Control */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kích thước: {size}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>128px</span>
                  <span>512px</span>
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu mã QR
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Màu nền
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Error Correction Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mức độ sửa lỗi
                </label>
                <select
                  value={errorLevel}
                  onChange={(e) =>
                    setErrorLevel(e.target.value as "L" | "M" | "Q" | "H")
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="L">Thấp (L) - 7%</option>
                  <option value="M">Trung bình (M) - 15%</option>
                  <option value="Q">Cao (Q) - 25%</option>
                  <option value="H">Rất cao (H) - 30%</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Mức độ sửa lỗi cao hơn giúp mã QR vẫn có thể quét được khi bị
                  hư hỏng
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview & Download */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Xem trước
              </h2>
              <div
                ref={qrRef}
                className="flex justify-center items-center bg-gray-50 rounded-lg p-8 min-h-[400px]"
              >
                {getQRValue() ? (
                  <QRCodeCanvas
                    value={getQRValue()}
                    size={size}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={errorLevel}
                    includeMargin={true}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <QrCode size={64} className="mx-auto mb-4 opacity-30" />
                    <p>Nhập nội dung để tạo mã QR</p>
                  </div>
                )}
              </div>

              {/* Download Buttons */}
              {getQRValue() && (
                <div className="mt-6 space-y-3">
                  <button
                    onClick={downloadQR}
                    className="w-full gradient-bg text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Download size={20} />
                    Tải xuống PNG
                  </button>
                  <button
                    onClick={downloadSVG}
                    className="w-full bg-gray-700 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    <Download size={20} />
                    Tải xuống SVG
                  </button>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Tính năng nổi bật
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="feature-card p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                  <div className="text-purple-600 mb-2">
                    <QrCode size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    Nhiều định dạng
                  </h4>
                  <p className="text-xs text-gray-600">
                    Hỗ trợ text, URL, email, WiFi và nhiều hơn nữa
                  </p>
                </div>
                <div className="feature-card p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                  <div className="text-green-600 mb-2">
                    <Download size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    Tải xuống dễ dàng
                  </h4>
                  <p className="text-xs text-gray-600">
                    Xuất file PNG hoặc SVG chất lượng cao
                  </p>
                </div>
                <div className="feature-card p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                  <div className="text-orange-600 mb-2">
                    <CreditCard size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    Miễn phí 100%
                  </h4>
                  <p className="text-xs text-gray-600">
                    Không giới hạn số lượng mã QR tạo
                  </p>
                </div>
                <div className="feature-card p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
                  <div className="text-pink-600 mb-2">
                    <MapPin size={24} />
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    Tùy chỉnh linh hoạt
                  </h4>
                  <p className="text-xs text-gray-600">
                    Đổi màu sắc, kích thước theo ý muốn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">
            DONATE : 050133514497 - SACOMBANK - DINH NGUYEN MINH HOANG
          </p>
        </div>
      </footer>
    </div>
  );
}

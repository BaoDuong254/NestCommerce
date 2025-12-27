import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/constants";
import http from "@/lib/http";
import "@/styles/upload-test.css";

interface UploadedImage {
  url: string;
  file: File;
}

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleLogout = () => {
    void (async () => {
      try {
        await logout();
        void navigate(ROUTES.LOGIN);
      } catch (error) {
        console.error("Logout failed:", error);
      }
    })();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    // Validate file types
    const validFiles = files.filter((file) => {
      const isValid = /\.(jpg|jpeg|png|webp)$/i.test(file.name);
      if (!isValid) {
        setError(`File ${file.name} không hợp lệ. Chỉ chấp nhận jpg, jpeg, png, webp`);
      }
      return isValid;
    });

    // Validate file sizes (5MB max)
    const validSizeFiles = validFiles.filter((file) => {
      const isValidSize = file.size <= 5 * 1024 * 1024;
      if (!isValidSize) {
        setError(`File ${file.name} quá lớn. Kích thước tối đa là 5MB`);
      }
      return isValidSize;
    });

    if (validSizeFiles.length > 0) {
      setSelectedFiles(validSizeFiles);
      setError("");

      // Create preview URLs
      const newPreviews = validSizeFiles.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Vui lòng chọn ít nhất một ảnh");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const uploadResults: UploadedImage[] = [];

      for (const file of selectedFiles) {
        // Step 1: Get presigned URL
        const presignedResponse = await http.post<{
          presignedUrl: string;
          url: string;
        }>("/api/v1/media/images/upload/presigned-url", {
          filename: file.name,
          filesize: file.size,
        });

        const { presignedUrl, url } = presignedResponse.data;

        // Step 2: Upload file to S3 using presigned URL
        await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        uploadResults.push({
          url,
          file,
        });
      }

      setUploadedImages((prev) => [...prev, ...uploadResults]);
      setSelectedFiles([]);
      setPreviews([]);

      // Clear file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      fileInput.value = "";
    } catch (err) {
      console.error("Upload error:", err);
      setError("Có lỗi xảy ra khi upload ảnh. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleRemoveUploaded = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const copyToClipboard = (url: string) => {
    void navigator.clipboard.writeText(url).then(() => {
      alert("Đã copy URL vào clipboard!");
    });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 justify-between'>
            <div className='flex'>
              <div className='flex shrink-0 items-center'>
                <h1 className='text-xl font-bold text-gray-900'>NestCommerce</h1>
              </div>
            </div>
            <div className='flex items-center'>
              <button
                onClick={handleLogout}
                className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='rounded-lg bg-white px-5 py-6 shadow sm:px-6'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900'>Welcome to NestCommerce!</h2>
          <div className='space-y-2'>
            <p className='text-gray-600'>You are successfully logged in.</p>
            {user && (
              <div className='mt-4 rounded-md bg-gray-50 p-4'>
                <h3 className='text-lg font-medium text-gray-900'>User Information</h3>
                <dl className='mt-2 space-y-1'>
                  <div>
                    <dt className='inline font-medium text-gray-700'>Name: </dt>
                    <dd className='inline text-gray-600'>{user.name}</dd>
                  </div>
                  <div>
                    <dt className='inline font-medium text-gray-700'>Email: </dt>
                    <dd className='inline text-gray-600'>{user.email}</dd>
                  </div>
                  <div>
                    <dt className='inline font-medium text-gray-700'>Phone: </dt>
                    <dd className='inline text-gray-600'>{user.phoneNumber}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div className='mt-8 rounded-lg bg-white px-5 py-6 shadow sm:px-6'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900'>Upload Ảnh lên AWS S3</h2>

          <div className='upload-area-wrapper'>
            <div className='upload-dropzone'>
              <input
                id='file-input'
                type='file'
                accept='.jpg,.jpeg,.png,.webp'
                multiple
                onChange={handleFileSelect}
                className='file-input-hidden'
              />
              <label htmlFor='file-input' className='upload-label'>
                <div className='upload-icon'>📁</div>
                <div className='upload-text'>Click để chọn ảnh hoặc kéo thả vào đây</div>
                <div className='upload-hint'>Hỗ trợ: JPG, JPEG, PNG, WEBP (Tối đa 5MB/ảnh)</div>
              </label>
            </div>

            {error && <div className='error-message'>{error}</div>}
          </div>

          {/* Preview Selected Files */}
          {selectedFiles.length > 0 && (
            <div className='preview-section'>
              <h3 className='section-title'>Ảnh đã chọn ({selectedFiles.length})</h3>
              <div className='preview-grid'>
                {selectedFiles.map((file, index) => (
                  <div key={index} className='preview-card'>
                    <img src={previews[index]} alt={file.name} className='preview-image' />
                    <div className='preview-info'>
                      <div className='preview-filename'>{file.name}</div>
                      <div className='preview-filesize'>{(file.size / 1024).toFixed(2)} KB</div>
                    </div>
                    <button
                      onClick={() => {
                        handleRemoveSelected(index);
                      }}
                      className='remove-button'
                      type='button'
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  void handleUpload();
                }}
                disabled={loading}
                className='upload-button'
                type='button'
              >
                {loading ? "Đang upload..." : "Upload lên S3"}
              </button>
            </div>
          )}

          {/* Uploaded Images */}
          {uploadedImages.length > 0 && (
            <div className='mt-6'>
              <h3 className='section-title'>Ảnh đã upload ({uploadedImages.length})</h3>
              <div className='uploaded-grid'>
                {uploadedImages.map((image, index) => (
                  <div key={index} className='uploaded-card'>
                    <img src={image.url} alt={image.file.name} className='uploaded-image' />
                    <div className='uploaded-info'>
                      <div className='uploaded-filename'>{image.file.name}</div>
                      <div className='uploaded-url'>{image.url}</div>
                      <div className='button-group'>
                        <button
                          onClick={() => {
                            copyToClipboard(image.url);
                          }}
                          className='copy-button'
                          type='button'
                        >
                          Copy URL
                        </button>
                        <button
                          onClick={() => {
                            handleRemoveUploaded(index);
                          }}
                          className='delete-button'
                          type='button'
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

"use client";
import React, { useState, useRef } from "react";
import { Image } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import ImageCropper from "../../components/ImageCropper";
import Draggable from "react-draggable"; // react-draggable 라이브러리를 추가해야 합니다
import {usePathname} from "next/navigation";
function Page() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [completedCrop, setCompletedCrop] = useState();
  const [title, setTitle] = useState("");
  const [draggedPosition, setDraggedPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const backgroundRef = useRef(null);
  const uploadedImgRef = useRef(null);
  const pathname = usePathname();

  const handleConfirmClick = () => {
    if (imgRef.current && completedCrop) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY
        );

        // Convert canvas to blob and then to base64
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setUploadedImage(reader.result);
            };
            reader.readAsDataURL(blob);
          }
        }, "image/png"); // Change to "image/png" to maintain transparency
      }
    }
  };

  const handleSaveImage = () => {
    if (backgroundRef.current) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const backgroundImg = new window.Image();

      backgroundImg.src = `/images/background${parseInt(pathname.split('/').pop()) + 1}.png`;

      backgroundImg.onload = () => {
        canvas.width = backgroundImg.width;
        canvas.height = backgroundImg.height;
        ctx.drawImage(backgroundImg, 0, 0);

        // Draw the uploaded image if it exists
        if (uploadedImage && uploadedImgRef.current) {
          const uploadedImg = new window.Image();
          uploadedImg.src = uploadedImage;

          uploadedImg.onload = () => {
            const scaleX = backgroundImg.width / backgroundRef.current.offsetWidth;
            const scaleY = backgroundImg.height / backgroundRef.current.offsetHeight;
            const x = draggedPosition.x * scaleX;
            const y = draggedPosition.y * scaleY;
            const width = uploadedImgRef.current.width * scaleX;
            const height = uploadedImgRef.current.height * scaleY;

            ctx.drawImage(uploadedImg, x, y, width, height);
            drawTitleAndSave();
          };
        } else {
          drawTitleAndSave();
        }
      };

      function drawTitleAndSave() {
        // Calculate the position of the title text
        const titleX = backgroundImg.width / 2;
        const titleY = backgroundImg.height * 4 / 13;
        
        // Draw the title text
        ctx.font = "1000px YoonDokrip";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(title, titleX, titleY);

        // Convert canvas to blob and then to base64
        canvas.toBlob((blob) => {
          if (blob) {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "overlayed_image.png";
            link.click();
          }
        }, "image/png");
      }
    }
  };

  const handleDragStop = (e, data) => {
    setDraggedPosition({ x: data.x, y: data.y });
  };
  console.log('pathname:',pathname)

  return (
    <div className="flex flex-col justify-center items-center w-full md:w-1/3 h-full gap-y-5">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                이미지 편집
              </ModalHeader>
              <ModalBody className="flex max-h-[80vh] overflow-y-auto">
                {/* <img src="/images/noimage.jpg" alt=""  className="w-full h-full"/> */}
                <ImageCropper
                  uploadedImage={uploadedImage}
                  setUploadedImage={setUploadedImage}
                  handleConfirmClick={handleConfirmClick}
                  imgRef={imgRef}
                  setCompletedCrop={setCompletedCrop}
                  completedCrop={completedCrop}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  취소
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleConfirmClick();
                    onClose();
                  }}
                >
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="relative w-full h-auto" ref={backgroundRef}>
        <div
          className="title-text w-full flex justify-center items-center absolute top-2.5 left-1/2 transform -translate-x-1/2 text-[62px] text-black"
          style={{ fontFamily: "YoonDokrip", fontWeight: 700 }}
        >
          {title}
        </div>

        <img
          alt="Background Image"
          src={`/images/background${parseInt(pathname.split('/').pop()) + 1}.png`}
          className="object-cover w-full h-full rounded-2xl"
        />
        {uploadedImage && (
          <Draggable bounds="parent" onStop={handleDragStop}>
            <img
              ref={uploadedImgRef}
              src={uploadedImage}
              alt="Uploaded Image"
              className="absolute top-0 left-0 w-1/2 h-auto cursor-move opacity-50"
            />
          </Draggable>
        )}
      </div>

      <Input
        value={title.length > 5 ? title.substring(0, 5) : title}
        onChange={(e) => setTitle(e.target.value.length > 5 ? e.target.value.substring(0, 5) : e.target.value)}
        type="email"
        label="상단 출력 문구"
      />
      <div className="flex gap-x-5 justify-center items-center w-full">
        
        {pathname.split('/').pop() === '0' && (
          <Button color="primary" onClick={onOpen}>
            사진업로드
          </Button>
        )}
        {uploadedImage && (
          <Button color="danger" onClick={() => setUploadedImage(null)}>
            이미지삭제
          </Button>
        )}
        <Button color="primary" onClick={handleSaveImage}>
          저장하기
        </Button>
      </div>
    </div>
  );
}

export default Page;

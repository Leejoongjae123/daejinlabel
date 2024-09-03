import React from "react";

function Footer() {
  return (
    <footer class=" rounded-lg dark:bg-gray-900 m-4 w-screen md:w-1/2">
      <div class="w-full mx-auto p-4 md:py-8">
        <div class="flex flex-col justify-center items-center">
          <img src="/images/qr.png" alt="logo" class=" w-[60vw] md:w-[20vw]  h-[60vw] md:h-[20vw]" />
          <div>
            <span class="text-black font-bold text-2xl">
              QR코드
            </span>
          </div>
        </div>
        <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span class="block text-center text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024 DAEJIN I&T All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;

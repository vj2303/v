"use client";
import React, { useState } from "react";
import { ChevronRight, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearOffer } from "../../../../../../redux/cartSlice";
import Image from "next/image";
import { CirclePercent } from 'lucide-react';
import Lottie from "lottie-react";
import discountAnimation from '../../../../../discount_animation.json';


const ChooseOffers = ({ onApplyOffer }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const appliedOffer = useSelector((state) => state.cart.appliedOffer);
  const [isLoading, setIsLoading] = useState(false); // To manage loading state

  const handleRemoveOffer = (e) => {
    e.stopPropagation(); // Prevent navigation when clearing the offer
    dispatch(clearOffer());
  };

  const handleChooseOffer = () => {
    if (appliedOffer) {
      // Trigger SuccessfullyApplied bottom sheet
      onApplyOffer(appliedOffer);
    } else {
      setIsLoading(true); // Start loading
      // Redirect to loading page
      // router.push("/loading");  // Redirect to the loading page first
      // Simulate a delay before navigating to the offers page (optional)
      setTimeout(() => {
        router.push("cart/offers"); // Then navigate to offers page
      }, 500); // Adjust the delay as needed
    }
  };

  return (
    <div
      className="py-2 flex mt-2 m-2 p-2 rounded-xl justify-between bg-white items-center cursor-pointer"
      onClick={handleChooseOffer}
    >
      <div className="text-[14px]">
        {appliedOffer ? (
          <>
            <p className="font-semibold">Offer Applied</p>
            <p className="text-blue-500">{appliedOffer.code}</p>
          </>
        ) : (
          <p className=" text-[18px] text-gray-500 font-medium gap-1 flex items-center">
            {/* <video width="30" height="30" autoplay loop muted>
              <source src="/MainScene.webm" type="video/webm" />
            </video> */}
               <Lottie
        animationData={discountAnimation}
        style={{ width: '30px', height: '30px' }} // Adjust size here
      />
            Choose Offer
          </p>
        )}
      </div>
      {appliedOffer ? (
        <CircleX
          onClick={handleRemoveOffer}
          className="cursor-pointer text-red-400 hover:text-red-600"
        />
      ) : isLoading ? (
        // Render the spinner during loading
        <div className="spinner"></div>
      ) : (
        <ChevronRight className="text-gray-400" />
      )}
    </div>
  );
};

export default ChooseOffers;

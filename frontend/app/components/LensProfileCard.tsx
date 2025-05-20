import React from "react";
import Image from "next/image";

interface LensProfileCardProps {
  hasProfile: boolean;
  profileData?: {
    displayName: string;
    handle: string;
    picture?: string;
  };
}

export default function LensProfileCard({
  hasProfile,
  profileData,
}: LensProfileCardProps) {
  if (hasProfile && profileData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4C4B7] max-w-md ">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16">
            {profileData.picture ? (
              <Image
                src={profileData.picture}
                alt={profileData.displayName}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#8B7355] flex items-center justify-center">
                <span className="text-white text-2xl">
                  {profileData.displayName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#8B7355]">
              {profileData.displayName}
            </h2>
            <p className="text-[#6B5B4E]">@{profileData.handle}</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-[#6B5B4E] font-medium">
            Got your Lens account! Let&apos;s start playing!
          </p>
          <div className="mt-2">
            <Image
              src="/lens.jpeg"
              alt="Lens Protocol"
              width={200}
              height={200}
              className="inline-block"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4C4B7] max-w-md mx-auto">
      <div className="text-center">
        <div className="text-4xl mb-4">😢</div>
        <h2 className="text-2xl font-bold text-[#8B7355] mb-2">
          Ohhh little boy...
        </h2>
        <p className="text-[#6B5B4E] mb-4">
          You don&apos;t have a Lens ID yet!
        </p>
        <a
          href="https://claim.lens.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#8B7355] hover:bg-[#6B5B4E] text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Get Your Lens ID Now
        </a>
      </div>
    </div>
  );
}

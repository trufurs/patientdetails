import React from "react";
import SafeImage from "./SafeImage";
import { DataProps } from "@/types";

type CardProps = {
    member: DataProps;
    index: number;
    start: number;
};

const NullValue = ({ value }: { value: string | number | null | undefined }) => {
    if (value === null || value === undefined || value === "") {
        return <span className="text-red-500">N/A</span>;
    }
    return <span>{value}</span>;
};

export default function Card({ member, index, start }: CardProps) {
    return (
        <div className="border rounded-lg overflow-hidden shadow-md">
            {/* Top blue section */}
            <div className="bg-blue-500 text-white p-4 flex items-start gap-3">
                {/* Image */}
                {(
                    <SafeImage
                        src={member.photo_url || "null"}
                        alt={member.patient_name || "Patient"}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white"
                        width={64}
                        height={64}
                    />
                )}

                {/* Name and ID section */}
                <div className="flex-1">
                    <div className="font-semibold text-lg">
                        <NullValue value={member.patient_name} />
                    </div>
                    <div className="text-blue-100 text-sm">
                        ID: <NullValue value={member.patient_id || `ID-${start + index + 1}`} />
                    </div>
                </div>

                {/* Age section on the right */}
                <div className="flex text-right items-center">
                    <div className="text-blue-100 text-sm">Age:</div>
                    <div className="font-semibold">
                        <NullValue value={member.age} />
                    </div>
                </div>
            </div >

            {/* Bottom white section */}
            < div className="bg-white p-4 space-y-2" >
                <div className="text-sm  whitespace-pre-wrap  ">
                    <button className="text-red-600 rounded-2xl px-4 border-amber-700 border-2  font-semibold bg-amber-100 p-2">
                        <NullValue value={member.medical_issue} />
                    </button>
                </div>
                <div className="text-sm flex">
                    <span className="font-medium text-gray-700">📍</span>
                    <div className="text-gray-600">
                        <NullValue value={member.contact?.[0]?.address} />
                    </div>
                </div>

                <div className="text-sm flex">
                    <span className="font-medium text-gray-700">📞</span>
                    <div className="text-gray-600">
                        <NullValue value={member.contact?.[0]?.number} />
                    </div>
                </div>

                <div className="text-sm flex">
                    <span className="font-medium text-gray-700">📧</span>
                    <div className="text-gray-600 break-all">
                        <NullValue value={member.contact?.[0]?.email} />
                    </div>
                </div>


            </div >
        </div >
    );
}
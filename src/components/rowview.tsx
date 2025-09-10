import React from "react";
import SafeImage from "./SafeImage";
import { DataProps } from "@/types";

type RowProps = {
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

export default function Row({ member, index, start }: RowProps) {
    return (
        <tr className="odd:bg-white even:bg-gray-50 ">
            <td className="px-4 py-2 ">
                <NullValue value={member.patient_id || `ID-${start + index + 1}`} />
            </td>
            <td className="px-4 py-2 ">
                <div className="flex items-center gap-2">

                    <SafeImage
                        src={member.photo_url || "null"}
                        alt={member.patient_name || "Patient"}
                        className="w-8 h-8 rounded-full object-cover"
                        width={32}
                        height={32}
                    />

                    <NullValue value={member.patient_name} />
                </div>
            </td>
            <td className="px-4 py-2 ">
                <NullValue value={member.age} />
            </td>
            <td className="px-4 py-2 ">
                <NullValue value={member.medical_issue} />
            </td>
            <td className="px-4 py-2 ">
                <NullValue value={member.contact?.[0]?.address} />
            </td>
            <td className="px-4 py-2 ">
                <NullValue value={member.contact?.[0]?.number} />
            </td>
            <td className="px-4 py-2 ">
                <NullValue value={member.contact?.[0]?.email} />
            </td>
        </tr>
    );
}
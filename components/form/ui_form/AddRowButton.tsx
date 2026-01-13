import { Button } from "@/components/ui/button";

// AddRowButton.tsx (または同じファイル内に定義)
interface AddRowButtonProps {
    onClick: () => void;
    currentCount: number;
    maxCount?: number;
    label?: string;
}

export const AddRowButton: React.FC<AddRowButtonProps> = ({
    onClick,
    currentCount,
    maxCount = 3,
    label = "行を追加"
}) => {
    const isDisabled = currentCount >= maxCount;

    return (
        <div className="flex gap-2 px-3 justify-end">
            {isDisabled && (
                <span className="text-sm text-gray-600">
                    （最大{maxCount}行まで）
                </span>
            )}
            <Button
                className=""
                type="button"
                onClick={onClick}
                disabled={isDisabled}
            >
                {label}
            </Button>
        </div>
    );
};
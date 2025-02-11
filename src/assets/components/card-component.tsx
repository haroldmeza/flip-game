export interface CardElement{
    id: number
    imageUrl: string
    isFlipped: boolean
    isMatched: boolean,
    handleChange: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, element: CardElement) => void;
};

export default function Card( element: CardElement){
    const { id, imageUrl, isFlipped, isMatched, handleChange } = element
    return <div className="w-full relative flip-container" data-id={`${id}`} onClick={(event) => handleChange(event, element)}>
        <div className={`card w-full relative ${isFlipped || isMatched ? "flip" : ""}`}>
            <div className="front size-full"></div>
            <div className="back size-full">
                <img src={`public/images/${imageUrl}.webp`} alt="" className="w-full" />
                    {isMatched && <div className="absolute size-full flex justify-center items-center">
                        <div className="bg-black opacity-50 z-10 size-full absolute"></div>
                        <img src="public/images/check.png" alt="" className="check-image z-20" />
                    </div>
                    }
            </div>
        </div>
    </div>
}
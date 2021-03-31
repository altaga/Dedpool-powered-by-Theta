import React, { useState } from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators
} from 'reactstrap';

import {
    isMobile
} from "react-device-detect";

const Carrousel = (props) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === props.elements.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? props.elements.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    if (isMobile) {
        const slides = props.elements.map((item) => {
            return (
                <CarouselItem
                    onExiting={() => setAnimating(false)}
                    onExited={() => setAnimating(false)}
                    key={item.key}
                    enableTouch={true}
                >
                    {item.comp}
                </CarouselItem>
            );
        }
        );
        return (
            <Carousel
                activeIndex={activeIndex}
                next={next}
                previous={previous}
            >
                <CarouselIndicators items={props.elements} activeIndex={activeIndex} onClickHandler={goToIndex} />
                {slides}
                <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
            </Carousel>
        )
    }
    else {
        const slides = props.elements.map((item) => {
            return (
                <CarouselItem
                    onExiting={() => setAnimating(false)}
                    onExited={() => setAnimating(false)}
                    key={item.key}
                >
                    {item.comp}
                </CarouselItem>
            );
        }
        );
        return (
            <Carousel
                activeIndex={activeIndex}
                next={next}
                previous={previous}
                style={{width:"100%"}}
            >
                <CarouselIndicators items={props.elements} activeIndex={activeIndex} onClickHandler={goToIndex} />
                {slides}
                <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
            </Carousel>
        )
    }
}

export default Carrousel;
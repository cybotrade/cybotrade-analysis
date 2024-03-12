'use client';

import { Dots } from '@app/_components/shared/Dots';
import {
  AverageTradesDaysWidget,
  BestTradeWidget,
  LargestRoiWidget,
  MaxDDWidget,
  TotalReturnWidget,
  WinRateWidget,
} from '@app/_components/widgets';
import { useCarousel } from '@app/_hooks/useCarousel';
import { CarouselContainer, CarouselContent, CarouselItem } from '@app/_ui/Carousel';

export const DataCarousel = () => {
  const { setApi, selectedIndex, totalSlides, handleDotButtonClick } = useCarousel();
  return (
    <div className="h-fit row-[2]">
      <CarouselContainer setApi={setApi} className="flex flex-col justify-between">
        <CarouselContent className="h-[24rem] max-w-[26.5rem]">
          <CarouselItem className="pl-4">
            <TotalReturnWidget />
          </CarouselItem>
          <CarouselItem className="pl-4">
            <WinRateWidget />
          </CarouselItem>
          <CarouselItem className="pl-4">
            <MaxDDWidget />
          </CarouselItem>
          <CarouselItem className="pl-4">
            <BestTradeWidget />
          </CarouselItem>
          <CarouselItem className="pl-4">
            <AverageTradesDaysWidget />
          </CarouselItem>{' '}
          <CarouselItem className="pl-4">
            <LargestRoiWidget />
          </CarouselItem>
        </CarouselContent>
        <Dots
          activeIndex={selectedIndex}
          count={totalSlides.length}
          handleDotClick={handleDotButtonClick}
        />
      </CarouselContainer>
    </div>
  );
};

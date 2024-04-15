'use client';

import { Decimal } from 'decimal.js';

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

type TDataCarouselProps = {
  data: {
    netProfit: Decimal;
    initialCapital: Decimal;
    winRate: Decimal;
    bestTrade: Decimal;
    largestRoi: Decimal;
    maxDrawdown: Decimal;
    averageTradesPerDay: number;
  };
};

export const DataCarousel = ({
  data: {
    netProfit,
    initialCapital,
    winRate,
    bestTrade,
    largestRoi,
    averageTradesPerDay,
    maxDrawdown,
  },
}: TDataCarouselProps) => {
  const { setApi, selectedIndex, totalSlides, handleDotButtonClick } = useCarousel();

  return (
    <div className="h-fit row-[2]">
      <CarouselContainer setApi={setApi} className="flex flex-col justify-between">
        <CarouselContent className="h-[23rem] max-w-[26.5rem]">
          <CarouselItem className="pl-4">
            <TotalReturnWidget netProfit={netProfit} initialCapital={initialCapital} />
          </CarouselItem>
          <CarouselItem className="pl-4">
            <WinRateWidget winRate={winRate} />
          </CarouselItem>
          <CarouselItem className="pl-4">
            <MaxDDWidget maxDrawdown={maxDrawdown} />
          </CarouselItem>
          <CarouselItem className="pl-4">
            <BestTradeWidget bestTrade={bestTrade} />
          </CarouselItem>
          <CarouselItem className="pl-4">
            <AverageTradesDaysWidget averageTradesPerDay={averageTradesPerDay} />
          </CarouselItem>
          <CarouselItem className="pl-4">
            <LargestRoiWidget largestRoi={largestRoi} />
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

'use client';

import { Decimal } from 'decimal.js';

import { MainWidget } from '@app/_components/dashboard/right/MainWidget';
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

export const WidgetsDisplay = ({
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
    <div className="h-full flex flex-col gap-2">
      <MainWidget
        content={<TotalReturnWidget netProfit={netProfit} initialCapital={initialCapital} />}
      />

      <CarouselContainer setApi={setApi} opts={{ slidesToScroll: 2 }}>
        <CarouselContent className="-ml-2 h-[9rem] max-w-[22rem]">
          <CarouselItem className="pl-2 basis-1/2 max-w-[1]">
            <WinRateWidget winRate={winRate} />
          </CarouselItem>
          <CarouselItem className="pl-2 basis-1/2">
            <BestTradeWidget bestTrade={bestTrade} />
          </CarouselItem>
          <CarouselItem className="pl-2 basis-1/2">
            <LargestRoiWidget largestRoi={largestRoi} />
          </CarouselItem>
          <CarouselItem className="pl-2 basis-1/2">
            <MaxDDWidget maxDrawdown={maxDrawdown} />
          </CarouselItem>
          <CarouselItem className="pl-2 basis-1/2">
            <AverageTradesDaysWidget averageTradesPerDay={averageTradesPerDay} />
          </CarouselItem>
          <CarouselItem className="pl-2 basis-1/2"></CarouselItem>
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

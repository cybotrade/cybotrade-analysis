import { Dots } from '@app/_components/shared/Dots';
import { getWidgetById } from '@app/_components/widgets';
import { useCarousel } from '@app/_hooks/useCarousel';
import { PerformanceData } from '@app/_lib/calculation';
import { useFileData } from '@app/_providers/file';
import { CarouselContainer, CarouselContent, CarouselItem } from '@app/_ui/Carousel';

type TWidgetCarouselProps = {
  performance: PerformanceData;
};
export const WidgetCarousel = ({ performance }: TWidgetCarouselProps) => {
  const { setApi, selectedIndex, totalSlides, handleDotButtonClick } = useCarousel();
  const { widgets } = useFileData();

  return (
    <CarouselContainer setApi={setApi} opts={{ slidesToScroll: 2 }}>
      <CarouselContent className="-ml-2 h-[9rem] max-w-[22rem]">
        {Object.keys(widgets).map((containerId) =>
          widgets[containerId].map(
            (widget) =>
              widget.children && (
                <CarouselItem className="pl-2 basis-1/2">
                  {getWidgetById(widget.children.type, performance)}
                </CarouselItem>
              ),
          ),
        )}
      </CarouselContent>
      <Dots
        activeIndex={selectedIndex}
        count={totalSlides.length}
        handleDotClick={handleDotButtonClick}
      />
    </CarouselContainer>
  );
};

import { EngineType } from 'embla-carousel/components/Engine';
import { Vector1DType } from 'embla-carousel/components/Vector1d';
import { useCallback, useEffect, useState } from 'react';

import { type CarouselApi } from '@app/_ui/Carousel';

export function useCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [totalSlides, setTotalSlides] = useState<number[]>([]);

  const onInit = useCallback((emblaApi: CarouselApi) => {
    setTotalSlides(emblaApi.scrollSnapList());
  }, []);

  const onScroll = useCallback((emblaApi: CarouselApi) => {
    const { limit, target, location, offsetLocation, scrollTo, translate, scrollBody } =
      emblaApi.internalEngine();
    let edge: number | null = null;

    if (limit.reachedMax(location.get())) edge = limit.max;
    if (limit.reachedMin(location.get())) edge = limit.min;

    if (edge === null) {
      translate.toggleActive(true);
      return;
    }

    offsetLocation.set(edge);
    location.set(edge);
    target.set(edge);
    translate.to(edge);
    translate.toggleActive(false);
    scrollBody.useDuration(0).useFriction(0);
    scrollTo.distance(0, false);
  }, []);

  const onSlideSelect = useCallback((emblaApi: CarouselApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const handleDotButtonClick = useCallback(
    (index: number) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api],
  );

  useEffect(() => {
    if (!api) return;
    onInit(api);
    onSlideSelect(api);
    // onScroll(api);

    api.on('reInit', onInit);
    api.on('select', onSlideSelect);
    // api.on('scroll', onScroll);

    return () => {
      api.off('reInit', onInit);
      api.off('select', onSlideSelect);
      // api.off('scroll', onScroll);
    };
  }, [api, onInit, onSlideSelect, onScroll]);

  return {
    setApi,
    selectedIndex,
    totalSlides,
    handleDotButtonClick,
  };
}

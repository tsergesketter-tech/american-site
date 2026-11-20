import { useEffect } from 'react';

// Lets a mouse click-and-drag scroll a horizontal strip the way a finger swipe
// would on the phone. Touch and trackpad already scroll natively, so only mouse
// pointers are handled. With `step` set, release snaps to the nearest item (a
// short flick advances one item in the swipe direction).
const useDragScroll = (ref, step) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    let moved = 0;
    let scale = 1;

    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      moved = 0;
      // The phone is CSS-scaled to fit the window; convert screen px to element px.
      scale = el.getBoundingClientRect().width / el.offsetWidth || 1;
      el.style.scrollSnapType = 'none';
      el.classList.add('is-dragging');
      el.setPointerCapture(e.pointerId);
    };

    const onMove = (e) => {
      if (!dragging) return;
      moved = (e.clientX - startX) / scale;
      el.scrollLeft = startLeft - moved;
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('is-dragging');
      if (!step) {
        el.style.scrollSnapType = '';
        return;
      }
      const maxIdx = Math.ceil((el.scrollWidth - el.clientWidth) / step);
      let idx = Math.round(el.scrollLeft / step);
      if (Math.abs(moved) > 30) idx = Math.round(startLeft / step) + (moved < 0 ? 1 : -1);
      idx = Math.max(0, Math.min(maxIdx, idx));
      el.scrollTo({ left: idx * step, behavior: 'smooth' });
      setTimeout(() => {
        el.style.scrollSnapType = '';
      }, 450);
    };

    const onDragStart = (e) => e.preventDefault();

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('dragstart', onDragStart);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('dragstart', onDragStart);
    };
  }, [ref, step]);
};

export default useDragScroll;

import { useRef, useLayoutEffect } from 'react';
//gotten directly from react-data-grid repo
function useFocusRef<T extends HTMLOrSVGElement>(isCellSelected: boolean) {
    const ref = useRef<T>(null);
    useLayoutEffect(() => {
      if (!isCellSelected) return;
      ref.current?.focus({ preventScroll: true });
    }, [isCellSelected]);
  
    return ref;
  }



interface CellExpanderFormatterProps {
  isCellSelected: boolean;
  isExpanded: boolean;
  onCellExpand: () => void;
}

export function CellExpanderFormatter({
  isCellSelected,
  isExpanded,
  onCellExpand
}: CellExpanderFormatterProps) {
  const iconRef = useFocusRef<HTMLSpanElement>(isCellSelected);

  function handleClick(e: React.MouseEvent<HTMLSpanElement>) {
    e.stopPropagation();
    onCellExpand();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onCellExpand();
    }
  }

  return (
    <div className='CellExpander'>
      <span onClick={handleClick} onKeyDown={handleKeyDown}>
        <span ref={iconRef} tabIndex={-1}>
          {isExpanded ? '\u25BC' : '\u25B6'}
        </span>
      </span>
    </div>
  );
}
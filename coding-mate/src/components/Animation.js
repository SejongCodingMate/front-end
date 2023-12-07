/**
 * Created by rla124
 */

import React from 'react';

function Animation({ animationType }) {
  let animationClass = '';

  if (animationType === 1) {
    animationClass = 'animation-type-1';
  } else if (animationType === 2) {
    animationClass = 'animation-type-2';
  } 

  return (
    <div className={`animation-container ${animationClass}`}>
      {/* 애니메이션 내용 */}
    </div>
  );
}

export default Animation;

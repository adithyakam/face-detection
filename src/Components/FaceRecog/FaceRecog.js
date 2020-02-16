import React from 'react';
import './faceRecog.css';

const FaceRecog = ({ imageUrl, box }) => {
  return (
    <div className='center  ma' >
      <div className='absolute  mt2'>
            <img id='inputimage' alt='' src={imageUrl} width='500px' height='auto'/>
        <div className='box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
      </div>
    </div>
  );
}

export default FaceRecog;
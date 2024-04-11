const Progress = ({ progressPercent }: { progressPercent: number }) => {
  // size of the circle
  const size = 128;
  // radius of the circle
  const radius = 40;
  // circumference of the circle
  const circumference = 2 * Math.PI * radius;
  // strokeDashoffset
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  return (
    <>
      <style>
        {`@keyframes circleStroke {
          from {
            stroke-dashoffset: ${circumference};
          }
          to {
            stroke-dashoffset: ${strokeDashoffset};
          }
        }
        @keyframes rotationObject {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(${progressPercent * 3.6}deg)
          }
        }
        `}
      </style>
      <div className="relative">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            r={radius}
            cx={size / 2}
            cy={size / 2}
            stroke="#CBD5E1"
            strokeWidth="15"
            fill="transparent"
            strokeDasharray={circumference}
          />
          <circle
            r={radius}
            cx={size / 2}
            cy={size / 2}
            stroke="#06B6D4"
            strokeWidth="15"
            fill="transparent"
            strokeDasharray={circumference}
            style={{
              animation: 'circleStroke 2s ease forwards',
            }}
          />
        </svg>
        <div
          className="absolute top-0 left-1/2 "
          style={{
            translate: '-50% -50%',
            transformOrigin: `center ${256 + 126 / 2}px`,
            animation: 'rotationObject 3s ease forwards',
          }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 text-5xl text-black whitespace-nowrap"
          style={{
            translate: '-50% -50%',
          }}
        >
          {progressPercent}%
        </div>
      </div>
    </>
  );
};

export { Progress };

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
        <svg viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            className="stroke-slate-300 stroke-[20px] fill-transparent"
          />
          <circle
            r={radius}
            cx={size / 2}
            cy={size / 2}
            strokeDasharray={circumference}
            className="stroke-primary-light stroke-[20px] fill-transparent"
            style={{
              animation: 'circleStroke 2s ease forwards',
            }}
          />
        </svg>

        <div className="absolute top-1/2 left-1/2 text-4xl text-black whitespace-nowrap -translate-x-1/2 -translate-y-1/2">
          {progressPercent}%
        </div>
      </div>
    </>
  );
};

export { Progress };

import React from 'react';
import Plot from 'react-plotly.js';

const SurfacePlot = () => {
  const z_data = [
    [8.83, 8.89, 8.81, 8.87, 8.9, 8.87],
    [8.89, 8.94, 8.85, 8.94, 8.96, 8.92],
    [8.84, 8.9, 8.82, 8.92, 8.93, 8.91],
    [8.79, 8.85, 8.79, 8.9, 8.94, 8.92],
    [8.79, 8.88, 8.81, 8.9, 8.95, 8.92],
    [8.8, 8.82, 8.78, 8.91, 8.94, 8.92],
    [8.75, 8.78, 8.77, 8.91, 8.95, 8.92],
    [8.8, 8.8, 8.77, 8.91, 8.95, 8.94],
    [8.74, 8.81, 8.76, 8.93, 8.98, 8.99],
    [8.89, 8.99, 8.92, 9.1, 9.13, 9.11],
    [8.97, 8.97, 8.91, 9.09, 9.11, 9.11],
    [9.04, 9.08, 9.05, 9.25, 9.28, 9.27],
    [9, 9.01, 9, 9.2, 9.23, 9.2],
    [8.99, 8.99, 8.98, 9.18, 9.2, 9.19],
    [8.93, 8.97, 8.97, 9.18, 9.2, 9.18],
  ];

  const x = [1, 2, 3, 4, 5, 6, 7, 8, 1];
  const y = [3.2, 5.2, 3.3, 8.4, 2.5, 6, 4.6, 7.7, 8.8];
  const z = [4, 6, 7, 2, 9, 3, 5, 7, 3];

  return (
    <div className="z-50">
      <Plot
        data={[
          {
            z: z_data,
            mode: 'markers',
            type: 'surface',
            marker: {
              size: 12,
              color: 'z',
              colorscale: 'Virdis',
              opacity: 0.5,
            },
          },
        ]}
      />
      <Plot
        data={[
          {
            mode: 'markers',
            type: 'mesh3d',
            x: x,
            y: y,
            z: z,
            colorscale: [
              [0, 'rgb(255, 0, 255)'],
              [0.5, 'rgb(0, 255, 0)'],
              [1, 'rgb(0, 0, 255)'],
            ],
            intensity: [
              0, 0.14285714285714285, 0.2857142857142857, 0.42857142857142855, 0.5714285714285714,
              0.7142857142857143, 0.8571428571428571, 1,
            ],
            marker: {
              size: 12,
              color: 'z',
              colorscale: 'Virdis',
              opacity: 0.8,
            },
          },
        ]}
      />
    </div>
  );
};

export default SurfacePlot;

// x = INDEX of number from the respective array
// y = INDEX of array
// z = VALUE of the number in the array

//       x x x x
//       | | | |
//       v v v v
// y -> [z,z,z,z]
// y -> [z,z,z,z]
// y -> [z,z,z,z]
// y -> [z,z,z,z]

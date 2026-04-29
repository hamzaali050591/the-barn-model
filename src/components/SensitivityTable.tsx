import { useMemo } from 'react';
import type { ModelInputs } from '../utils/types';
import { runModelWith } from '../utils/engine';
import { fmtPct } from '../utils/format';

interface Props {
  inputs: ModelInputs;
}

const EXIT_MULTIPLES = [2, 3, 4, 5, 6];
const LOCATION_COUNTS = [5, 6, 7, 8, 9];

export default function SensitivityTable({ inputs }: Props) {
  const grid = useMemo(() => {
    return EXIT_MULTIPLES.map(em =>
      LOCATION_COUNTS.map(nl => {
        const result = runModelWith(inputs, {
          exitMultiple: em,
          numLocations: nl,
        });
        return result.irr;
      })
    );
  }, [inputs]);

  return (
    <div className="glass rounded-2xl p-4 md:p-5">
      <h3 className="text-base font-bold text-walnut mb-3">Sensitivity: IRR by Exit Multiple & # Locations</h3>
      <div className="overflow-x-auto scroll-fade-x">
        <table className="w-full text-xs md:text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-walnut-light font-semibold">
                Exit / Locs
              </th>
              {LOCATION_COUNTS.map(n => (
                <th
                  key={n}
                  className={`px-3 py-2 text-center font-semibold ${
                    n === inputs.numLocations ? 'text-honey' : 'text-walnut-light'
                  }`}
                >
                  {n} Locs
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EXIT_MULTIPLES.map((em, ri) => (
              <tr key={em} className="border-t border-walnut/5">
                <td className={`px-3 py-2 font-semibold ${
                  em === inputs.exitMultiple ? 'text-honey' : 'text-walnut-light'
                }`}>
                  {em}&times;
                </td>
                {LOCATION_COUNTS.map((nl, ci) => {
                  const isActive =
                    em === inputs.exitMultiple && nl === inputs.numLocations;
                  return (
                    <td
                      key={nl}
                      className={`px-3 py-2 text-center tabular-nums ${
                        isActive
                          ? 'bg-honey text-white font-bold rounded-md'
                          : 'text-walnut'
                      }`}
                    >
                      {fmtPct(grid[ri][ci])}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

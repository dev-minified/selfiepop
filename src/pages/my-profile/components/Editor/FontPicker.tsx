import { getFontList } from 'api/Utils';
import Scrollbar from 'components/Scrollbar';
import SimpleCard from 'components/SPCards/SimpleCard';
import { Fragment, ReactElement, useEffect, useState } from 'react';
import { positionValues } from 'react-custom-scrollbars-2';
import { Helmet } from 'react-helmet';
import { getCSSFontURL } from 'util/index';

const SelectedFonts = {
  Abel: 'Abel',
  Alata: 'Alata',
  'Bad Script': 'Bad Script',
  'Baloo 2': 'Baloo 2',
  'Chakra Petch': 'Chakra Petch',
  Codystar: 'Codystar',
  'Cutive Mono': 'Cutive Mono',
  'Fjalla One': 'Fjalla One',
  'Fredericka the Great': 'Fredericka the Great',
  'Indie Flower': 'Indie Flower',
  'Josefin Slab': 'Josefin Slab',
  'Kosugi Maru': 'Kosugi Maru',
  Laila: 'Laila',
  'Life Savers': 'Life Savers',
  Lobster: 'Lobster',
  Lora: 'Lora',
  Mali: 'Mali',
  Mulish: 'Mulish',
  Montserrat: 'Montserrat',
  'Nixie One': 'Nixie One',
  'Open Sans': 'Open Sans',
  Orbitron: 'Orbitron',
  Oswald: 'Oswald',
  Poppins: 'Poppins',
  'Press Start 2P': 'Press Start 2P',
  Quicksand: 'Quicksand',
  Raleway: 'Raleway',
  Roboto: 'Roboto',
  'Roboto Condensed': 'Roboto Condensed',
  'Roboto Mono': 'Roboto Mono',
  Rubik: 'Rubik',
  'Shadows Into Light': 'Shadows Into Light',
  'Source Serif Pro': 'Source Serif Pro',
  'Special Elite': 'Special Elite',
  'Text Me One': 'Text Me One',
  'Varela Round': 'Varela Round',
};
interface Props {
  value?: Font;
  onChange?: Function;
  name?: string;
}
interface IPage {
  pageSize: number;
  page: number;
}
export default function FontPicker({
  value: initialValue,
  onChange,
  name,
}: Props): ReactElement {
  const [selectedFont, setSelectedFont] = useState<Font>();
  const [fonts, setFonts] = useState<Font[]>([]);
  const [{ pageSize, page }, setPageDetial] = useState<IPage>({
    pageSize: 15,
    page: 1,
  });

  useEffect(() => {
    onChange && onChange(name, selectedFont);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFont?.family]);

  useEffect(() => {
    if (initialValue) {
      setSelectedFont(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue?.family]);

  useEffect(() => {
    getFontList()
      .then((response) => {
        const updatedFonts = response.items?.filter(
          (a: Record<string, any>) => {
            const key: keyof typeof SelectedFonts = a.family;
            return SelectedFonts[key] !== undefined;
          },
        );
        updatedFonts.forEach((a: any) => {
          const fileKeys: String[] = [...Object.keys(a.files)];
          const newFonts: Record<string, any> = {};
          fileKeys?.forEach((f) => {
            if (!f.includes('italic')) {
              newFonts[f as any] = a.files[f as any];
            }
          });
          a.variants = a.variants?.filter((v: String) => !v.includes('italic'));
          a.files = newFonts;
        });
        setFonts(updatedFonts);
      })
      .catch(console.log);
  }, []);
  const arrayToShow = fonts.slice(0, pageSize * page);

  const NextPage = () => {
    setPageDetial((s) => {
      return { ...s, page: s.page + 1 };
    });
  };

  const handleUpdate = (values: positionValues) => {
    if (!fonts.length) return;
    const { scrollTop, scrollHeight, clientHeight } = values;
    const pad = 300; // 50px of the bottom
    // t will be greater than 1 if we are about to reach the bottom
    const t = (scrollTop + pad) / (scrollHeight - clientHeight);
    if (t > 1) NextPage();
  };

  return (
    <Fragment>
      <Helmet>
        {arrayToShow.map((item, index: number) => (
          <link key={index} href={getCSSFontURL(item)} rel="stylesheet" />
        ))}
      </Helmet>
      <SimpleCard
        showHeader={false}
        // classes={{ body: 'p-md-20 p-10' }}
        styles={{ body: { height: 500 } }}
      >
        <div className="h-100">
          <Scrollbar onUpdate={handleUpdate}>
            <div className="p-md-20 p-10">
              <div className="mb-10 editor-head">
                <h5 className="font-weight-medium">Fonts</h5>
                <p className="mb-10 cover-size-body">
                  Completely customize your Pop Page. Change your background
                  with colors, gradients and images. Choose a button style,
                  change the typeface and more.
                </p>
              </div>
              <ul className="list-fonts mx-n10">
                {arrayToShow.map((font, index: number) => {
                  return (
                    <li
                      className={`list-fonts__item ${
                        font.family === selectedFont?.family && 'selected'
                      }`}
                      onClick={() => {
                        setSelectedFont(font);
                      }}
                      key={index}
                    >
                      <div className="list-fonts__font-block">
                        <span
                          className="list-fonts__font-block__text"
                          style={{
                            fontFamily: `${font.family}, ${font.category}`,
                          }}
                        >
                          Aa
                        </span>
                      </div>
                      <span className="list-fonts__font-family">
                        {font.family}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Scrollbar>
        </div>
      </SimpleCard>
    </Fragment>
  );
}

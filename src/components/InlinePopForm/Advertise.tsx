import { Advertise as AdIcon } from 'assets/svgs';
import { CardSection } from 'components/SPCards/SimpleCard';
import { ReactElement } from 'react';
import styled from 'styled-components';
import VariationDragableListing from './VariationDragableListing';

interface Props {
  socialMediaLinks: any;
  socialMediaSorting?: string[];
  priceVariations: PriceVariant[];
  setField?: (name: string, value: any) => void;
  onChange: any;
  className?: string;
}

function Advertise({
  socialMediaLinks,
  priceVariations,
  onChange,
  className,
}: Props): ReactElement {
  const handleChange = (
    name: string,
    value: PriceVariant[],
    variant?: any,
    action?: string,
  ) => {
    onChange && onChange(name, value, variant, action);
  };

  return (
    <div className={`${className} schedule-block`}>
      {/* <DashedLine className="dashed" /> */}
      <div className="addition__art mb-30 shoutout-block">
        <CardSection
          title="Social Offerings"
          subtitle="Add your social offerings here!"
          icon={<AdIcon />}
          className="rc-card-header-large"
        >
          <div className="shoutout-block__body-area">
            {!priceVariations?.length && (
              <p>
                You do not currently have any promotional shoutouts defined.
                Please click the button below to create your first offering.
              </p>
            )}
            <div className="price--variation">
              <VariationDragableListing
                addVariationbtnTitle="Add Promotional Shoutout"
                value={priceVariations}
                onChange={(
                  value: PriceVariant[],
                  variant?: any,
                  action?: string,
                ) => {
                  handleChange('priceVariations', value, variant, action);
                }}
                socialMediaLinks={socialMediaLinks}
                title="Advertise"
                type="advertise"
                renderQuestionInForm={true}
                itemStyleType="compact"
                buttonPosition="bottom"
                showItemPriceTag={false}
                // itemSubtitle={getSubTitle}
              />
            </div>
          </div>
        </CardSection>
      </div>
    </div>
  );
}
export default styled(Advertise)`
  .icon {
    #Layer_1 {
      fill: transparent;
    }
  }
`;

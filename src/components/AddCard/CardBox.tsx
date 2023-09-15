import styled from 'styled-components';

const AddMethodWidget = styled.div`
  padding: 15px;
  overflow: hidden;
  background: var(--pallete-background-primary-light);
  margin: 0 0 14px;
  border-radius: 3px;
  border: 1px solid var(--pallete-colors-border);

  .head {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin: 0 0 15px;
  }

  .btn-close {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 100%;
    color: #fff;
    font-size: 14px;
    background: #cecfd1;
    cursor: pointer;

    .sp_dark & {
      background: #666;
    }
  }

  .btn-close:hover {
    background: #afafaf;
  }

  .title {
    display: block;
    color: var(--pallete-text-main);
    font-size: 15px;
    font-weight: 500;
  }

  .form-holder {
    overflow: hidden;
  }

  .fields-wrap {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .field {
    width: 62.25%;
    padding: 12px 20px 7px;
    background-color: var(--pallete-background-gray-darker);
    border-radius: 3px;
    margin: 0 0 15px;
  }

  .field:last-child {
    width: 35.39%;
  }

  label {
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    color: #a8a8a8;
    margin: 0;
    text-transform: uppercase;
  }

  .text-input {
    background: none;
    font-family: 'Roboto', sans-serif;
    border: none;
    font-weight: 400;
    color: var(--pallete-text-main-50);
    padding: 5px 0;
    width: 100%;
  }

  .text-input::-webkit-input-placeholder {
    color: var(--pallete-text-main-50);
  }

  .text-input::-moz-placeholder {
    opacity: 1;
    color: var(--pallete-text-main-50);
  }

  .text-input:-moz-placeholder {
    color: var(--pallete-text-main-50);
  }

  .text-input:-ms-input-placeholder {
    color: var(--pallete-text-main-50);
  }

  .text-input.placeholder {
    color: var(--pallete-text-main-50);
  }

  .text-input:focus {
    outline: none;
    box-shadow: none;
  }

  .sm-fields-wrap {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }

  .sm-field {
    padding-right: 8px;
  }

  .custom-checkbox {
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
    text-transform: none;
  }

  .custom-checkbox [type='checkbox'] {
    position: fixed;
    display: none;
    left: 0;
    top: 0;
    opacity: 0;
    z-index: -1;
  }

  .custom-checkbox .custom-input {
    display: inline-block;
    width: 25px;
    height: 25px;
    border: 1px solid #dad8d8;
    background: var(--pallete-background-default);
    vertical-align: middle;
    position: relative;
    margin-right: 10px;
    border-radius: 100%;
  }

  .custom-checkbox .label-text {
    font-size: 15px;
    color: #cccdd0;
    font-weight: 500;
    -webkit-transition: all 0.25s ease;
    transition: all 0.25s ease;
  }

  .custom-checkbox [type='radio'] + .custom-input {
    border-radius: 100%;
  }

  .custom-checkbox [type='radio'] + .custom-input:after {
    border-radius: 100%;
  }

  .custom-checkbox [type='checkbox'] + .custom-input:before {
    content: '';
    position: absolute;
    top: 5px;
    right: 5px;
    bottom: 5px;
    left: 5px;
    border-radius: 100%;
    background: #e0e0e0;
    border-radius: 100%;
    -webkit-transition: all 0.25s ease;
    transition: all 0.25s ease;

    .sp_dark & {
      background: #666;
    }
  }

  .custom-checkbox:hover .label-text,
  .custom-checkbox [type='checkbox']:checked ~ .label-text {
    color: var(--pallete-text-main);
  }

  .custom-checkbox:hover [type='checkbox'] + .custom-input:before,
  .custom-checkbox [type='checkbox']:checked + .custom-input:before {
    background: var(--pallete-text-main);
  }

  @media (max-width: 767px) {
    .fields-wrap {
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -ms-flex-flow: row wrap;
      flex-flow: row wrap;
    }

    .field {
      width: 100%;
    }

    .field:last-child {
      width: 100%;
    }

    .field.cvc-code {
      width: 70px;
      text-align: center;
      margin: 0;
    }

    .field.cvc-code .text-input {
      text-align: center;
    }

    .text-input {
      font-size: 14px;
    }

    .sm-field {
      padding-right: 5px;
    }

    .checkbox-wrap.cvc-code-check {
      margin: 0 !important;
      position: relative;
    }

    .checkbox-wrap.cvc-code-check .custom-checkbox {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 125px;
      margin: -48px 0 0 40px;
    }

    .custom-checkbox .label-text {
      font-size: 14px;
    }
  }
`;
const CardBox = ({
  title,
  card,
  index,
  makePrimary,
  deleteCard,
  showDelete = true,
  showSelector = true,
  disabledInput = false,
}: any) => {
  const handlePrimary = () => {
    if (card.isPrimary) return;
    if (makePrimary) makePrimary(card.id);
  };
  const handleDelete = () => {
    if (deleteCard) deleteCard(card.id);
  };
  return (
    <AddMethodWidget className="addmethod-widget mb-35" key={card.id}>
      <div className="head" style={{ marginTop: 2 }}>
        <strong className="title">
          {title ?? `Saved Card ${index + 1}`}
          {card.isExpired ? (
            <span className="badge badge-danger">Expired</span>
          ) : (
            ''
          )}{' '}
        </strong>
        {showDelete && !card.isPrimary && (
          <span className="btn-close" onClick={handleDelete}>
            <span
              className="icon-clearclose delete-billing-method"
              data-id={card.id}
            ></span>
          </span>
        )}
      </div>
      <div className="form-holder">
        <div className="fields-wrap">
          <div className="field">
            <label>NAME ON CARD</label>
            <input
              disabled={disabledInput}
              id="name"
              className="text-input"
              type="text"
              placeholder={card.name}
            />
          </div>
          <div className="field">
            <label>EXPIRATION DATE</label>
            <input
              disabled={disabledInput}
              id="date"
              className="text-input"
              type="text"
              placeholder={`${card.exp_month} / ${card.exp_year}`}
            />
          </div>
        </div>
        <div className="fields-wrap">
          <div
            className="field"
            style={{ paddingBottom: 12, paddingRight: 12 }}
          >
            <label>CARD NUMBER</label>
            <div className="sm-fields-wrap">
              <div className="sm-field">
                <input
                  id="number"
                  className="text-input"
                  type="text"
                  placeholder="• • • •"
                  disabled={disabledInput}
                />
              </div>
              <div className="sm-field">
                <input
                  className="text-input"
                  type="text"
                  placeholder="• • • •"
                  disabled={disabledInput}
                />
              </div>
              <div className="sm-field">
                <input
                  className="text-input"
                  type="text"
                  placeholder="• • • •"
                  disabled={disabledInput}
                />
              </div>
              <div className="sm-field">
                <input
                  className="text-input"
                  type="text"
                  defaultValue={card.last4}
                  disabled={disabledInput}
                />
              </div>
              <div className="icon">
                <img
                  width="45"
                  height="28"
                  src={`/assets/images/stripe-cards/${card.brand}.png`}
                  alt="img description"
                />
              </div>
            </div>
          </div>
          <div className="field cvc-code">
            <label htmlFor="cvc">CVC</label>
            <input
              id="cvc"
              readOnly
              className="text-input"
              type="text"
              placeholder="• • •"
              disabled={disabledInput}
            />
          </div>
        </div>
        {showSelector && (
          <div className="mt-10 checkbox-wrap cvc-code-check">
            <label
              className="custom-checkbox"
              onClick={handlePrimary}
              htmlFor={index}
            >
              <input
                name={index}
                className="set-primary-method-card"
                type="checkbox"
                checked={card.isPrimary}
                readOnly
              />
              <span className="custom-input"></span>
              <span className="label-text">Use This Card</span>
            </label>
          </div>
        )}
      </div>
    </AddMethodWidget>
  );
};

export default CardBox;

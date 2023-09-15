import Pagination from 'rc-pagination';
// import 'rc-pagination/assets/index.css';
import styled from 'styled-components';
export default styled(Pagination)`
  margin: 0;
  padding: 0;
  list-style: none;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  font-size: 15px;
  line-height: 18px;
  margin: 0 0 14px;

  li {
    padding: 0 3px;
    height: auto;
    outline: none;
    box-shadow: none;

    &:first-child {
      a,
      button {
        border-radius: 4px 0 0 4px;
      }
    }

    &:last-child {
      a,
      button {
        border-radius: 0 4px 4px 0;
      }
    }

    a,
    button,
    &.rc-pagination-next,
    &.rc-pagination-prev {
      color: #747474;
      padding: 5px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--pallete-colors-border);
      background: none;
      border-radius: 6px;

      .sp_dark & {
        border-color: transparent;
        color: rgba(255, 255, 255, 0.5);
      }

      &:hover {
        background: var(--colors-indigo-200);
        border-color: var(--colors-indigo-200);
        color: #fff;

        .sp_dark & {
          background: rgba(255, 255, 255, 0.2);
          border-color: transparent;
          color: #fff;
        }
      }
    }

    &.rc-pagination-next,
    &.rc-pagination-prev {
      cursor: pointer;
      transition: all 0.4s ease;
      margin: 0 20px 0 0;

      .sp_dark & {
        background: rgba(255, 255, 255, 0.1);
        border-color: transparent;
        /* color: #fff; */
      }

      svg {
        width: 12px;
        height: auto;
        display: block;
      }
    }

    &.rc-pagination-next {
      margin: 0 0 0 20px;

      svg {
        transform: rotate(180deg);
      }
    }

    .rc-pagination-item-active {
      a,
      button {
        background: var(--pallete-primary-main);
        border-color: var(--pallete-primary-main);
        color: #fff;

        .sp_dark & {
          background: rgba(255, 255, 255, 0.2);
          border-color: transparent;
          color: #fff;
        }
      }
    }
  }

  .rc-pagination-item-active {
    a {
      background: var(--pallete-primary-main);
      border-color: var(--pallete-primary-main);
      color: #fff;

      .sp_dark & {
        background: rgba(255, 255, 255, 0.2);
        border-color: transparent;
        color: #fff;
      }
    }
  }

  .rc-pagination-next {
    .rc-pagination-item-link {
      &:after {
        display: block;
        content: 'Next';
      }
    }
  }

  .rc-pagination-prev {
    .rc-pagination-item-link {
      &:after {
        display: block;
        content: 'Previous';
      }
    }
  }

  .rc-pagination-jump-next,
  .rc-pagination-jump-prev {
    .rc-pagination-item-link {
      background: none;
      border: none;
      outline: none;

      &:hover {
        color: var(--colors-indigo-200);

        .sp_dark & {
          color: #fff;
        }
      }

      &:after {
        display: block;
        content: '•••';
      }
    }
  }
`;

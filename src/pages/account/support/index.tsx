import {
  getTicket,
  getTickets,
  sendTicketMessage,
  updateTicket,
} from 'api/Support';
import { SUPPORT_TICKETS_STATUS_OPTIONS } from 'appconstants';
import { ArrowBack, CustomAgent } from 'assets/svgs';
import useAuth from 'hooks/useAuth';
import useControllTwopanelLayoutView from 'hooks/useControllTwopanelLayoutView';
import useRequestLoader from 'hooks/useRequestLoader';
import { ITicket } from 'interfaces/Ticket';
import TwoPanelLayout from 'layout/TwoPanelLayout';
import { stringify } from 'querystring';
import { ReactElement, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { parseQuery } from 'util/index';
import SupportTable from './components/SupportTickets';
import TicketDetails from './components/TicketDetails';
interface Props {
  className?: string;
}
const PAGE_LIMIT = 5;
function Index({ className }: Props): ReactElement {
  const history = useHistory();
  const { user } = useAuth();
  const { showLeftView, showRightView } = useControllTwopanelLayoutView();

  const [selected, setSelected] = useState(SUPPORT_TICKETS_STATUS_OPTIONS[0]);
  const [tickets, setTickets] = useState<{
    totalCount: number;
    items: ITicket[];
  }>({ totalCount: 0, items: [] });
  const [selectedTicket, setSelectedTicket] = useState<ITicket>({});
  const {
    page: pageNumber,
    status = '',
    id: ticketId,
  } = parseQuery(useLocation().search);
  const { withLoader } = useRequestLoader();
  useEffect(() => {
    const pageIndex = Number(pageNumber) || 1;
    const skip = (pageIndex - 1) * PAGE_LIMIT;
    let selectedStatus =
      SUPPORT_TICKETS_STATUS_OPTIONS.find((s) => s.value === status) ||
      SUPPORT_TICKETS_STATUS_OPTIONS[0];
    const paramsList: any = {
      skip,
      limit: PAGE_LIMIT,
      status: selectedStatus.value,
      sort: 'createdAt',
      order: 'desc',
    };

    if (ticketId) {
      withLoader(getTicket(ticketId as string))
        .then((res) => {
          setTickets({
            items: [res],
            totalCount: 1,
          });
          setSelectedTicket(res);
          selectedStatus =
            SUPPORT_TICKETS_STATUS_OPTIONS.find(
              (s) => s.value === res.issueStatus,
            ) || SUPPORT_TICKETS_STATUS_OPTIONS[0];
          setSelected(selectedStatus);
        })
        .catch(console.log);
      return;
    }

    setSelected(selectedStatus);

    withLoader(getTickets(paramsList, user?.isSupportAgent))
      .then((res) => {
        setTickets(res);
        setSelectedTicket(res.items[0]);
      })
      .catch(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, status, ticketId]);

  const handleChange = (v: any) => {
    const Parsequery = { page: pageNumber, status: status || selected.value };
    Parsequery.status = v.value;

    Parsequery.page = '1';
    const queryString = stringify(Parsequery);
    history.push(`?${queryString}`);
  };

  const handlePage = (page: number) => {
    const Parsequery = { page: pageNumber, status: status || selected.value };
    Parsequery.page = page.toString();
    const queryString = stringify(Parsequery);
    history.push(`?${queryString}`);
  };

  const onCreateTicketCallback = (ticket: ITicket) => {
    setTickets((prev) => ({
      ...prev,
      items: [ticket, ...prev?.items],
      totalCount: prev?.totalCount + 1,
    }));
    setSelectedTicket(ticket);
  };
  const sendMessages = async (
    message: string,
    ticket: ITicket,
    attachments: any[],
  ) => {
    if (ticket._id) {
      const res = await sendTicketMessage(
        message,
        ticket._id,
        user?.isSupportAgent,
        attachments,
      ).catch(console.log);
      if (res) {
        setTickets((prev) => ({
          ...prev,
          items: prev.items.map((i) =>
            i._id === ticket._id
              ? { ...i, issueComments: res.issueComments }
              : i,
          ),
        }));
        if (ticket._id === selectedTicket._id) {
          setSelectedTicket({
            ...selectedTicket,
            issueComments: res.issueComments,
          });
        }
      } else {
        throw new Error();
      }
    }
  };
  const sendMessage = async (
    message: string,
    ticket: ITicket,
    attachments: any[],
  ) => {
    if (ticket._id) {
      sendMessages(message, ticket, attachments);
    }
  };

  const updateTickets = (id: string, ticket: ITicket) => {
    setTickets((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i._id === id ? ticket : i)),
    }));
  };

  const closeTicket = async (ticket: ITicket) => {
    if (!ticket._id) {
      return;
    }

    const res: any = await updateTicket(ticket._id, {
      issueStatus: 'closed',
    }).catch(console.log);

    if (res) {
      setTickets((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i._id === ticket._id ? res.ticket : i)),
      }));
      if (ticket._id === selectedTicket._id) {
        setSelectedTicket(res.ticket);
      }
    } else {
      throw new Error();
    }
  };

  const { totalCount = 0, items = [] } = tickets;

  useEffect(() => {
    showLeftView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <TwoPanelLayout
        leftView={
          <SupportTable
            onCreateTicketCallback={onCreateTicketCallback}
            emptyTitle={`You currently do not have any ${status} Tickets`}
            icon={<CustomAgent />}
            key={'_id'}
            title={
              <span>
                <span className="title-text">
                  <span className="title-text-holder">Support Tickets :</span>
                  <span className="counter-text">{totalCount} Tickets </span>
                </span>
              </span>
            }
            selectProps={{ selected, handleChange }}
            data={items}
            onRowClick={(row) => {
              setSelectedTicket(row);
              showRightView();
            }}
            paginationProps={{
              total: totalCount,
              current: parseInt(pageNumber as string) || 1,
              pageSize: PAGE_LIMIT,
              onChange: handlePage,
              nextIcon: <ArrowBack />,
              prevIcon: <ArrowBack />,
              showLessItems: window.innerWidth < 600,
              showPrevNextJumpers: window.innerWidth > 600,
            }}
          />
        }
        rightView={
          <div className="p-20">
            {selectedTicket?._id && (
              <TicketDetails
                ticket={selectedTicket}
                sendMessage={sendMessage}
                updateTicket={updateTickets}
                closeTicket={closeTicket}
              />
            )}
          </div>
        }
      />
    </div>
  );
}
export default styled(Index)`
  .title {
    .counter-text {
      color: var(--pallete-primary-main);
    }
  }
`;

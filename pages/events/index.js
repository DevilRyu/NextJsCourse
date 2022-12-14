import Layout from "@/components/Layout";
import EventItem from "@/components/EventItem";
import { API_URL, PER_PAGE } from "@/config/index";
import Pagination from "@/components/Pagination";

export default function EventsPage({ events, page, total }) {
    const lastPage = Math.ceil(total / PER_PAGE);

    return (
        <Layout>
            <h1>Events</h1>
            {events.length === 0 && <h3>No events to show </h3>}
            {events.map((evt) => (
                <EventItem key={evt.id} evt={evt} />
            ))}

            <Pagination page={page} total={total}/>
        </Layout>
    );
}

export async function getServerSideProps({ query: { page = 1 } }) {
    // Calculate start page
    const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

    // Fetch total/count
    const totalRes = await fetch(`${API_URL}/api/events?populate=*`);
    const total = await totalRes.json();

    // Fetch events
    const eventRes = await fetch(
        `${API_URL}/api/events?populate=*&sort=date:asc&pagination[start]=${start}&pagination[limit]=${PER_PAGE}`
    );
    const events = await eventRes.json();

    return {
        props: {
            events: events.data,
            page: +page,
            total: total.meta.pagination.total,
        },
    };
}

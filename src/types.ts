export interface MetricsData {
    record_count: number;
    health_score: number;
    data_source: string;
    date: string;
    capture: {
        total_tickets: number;
        complete_tickets: number;
        completeness_rate: number;
    };
    allocate: {
        total_assigned: number;
        completed: number;
        completion_rate: number;
        overdue_count: number;
    };
    validate: {
        total_complaints: number;
        processed: number;
        pending: number;
        justification_rate: number;
        backlog_ratio: number;
    };
    resolve: {
        total_complaints: number;
        total_requiring_rca: number;
        rca_initiated: number;
        rca_initiation_rate: number;
        rca_completed: number;
        rca_completion_rate: number;
        closed_complaints: number;
        closure_rate: number;
    };
}

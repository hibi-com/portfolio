import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@portfolio/ui";
import { Link } from "@tanstack/react-router";
import { DollarSign, Edit, MoreVertical, Plus, Trash2, TrendingUp } from "lucide-react";
import type { Deal, PipelineStage } from "~/shared/lib/crm-api";
import { useDeals } from "../lib/useDeals";

const statusColors: Record<Deal["status"], string> = {
    OPEN: "bg-blue-100 text-blue-800",
    WON: "bg-green-100 text-green-800",
    LOST: "bg-red-100 text-red-800",
    ABANDONED: "bg-gray-100 text-gray-800",
};

interface DealCardProps {
    deal: Deal;
    onDelete: (id: string) => void;
}

function DealCard({ deal, onDelete }: Readonly<DealCardProps>) {
    const handleDelete = () => {
        if (globalThis.confirm("Are you sure you want to delete this deal?")) {
            onDelete(deal.id);
        }
    };

    return (
        <Card className="mb-2 cursor-pointer transition-shadow hover:shadow-md">
            <CardContent className="p-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="font-medium text-sm">{deal.name}</p>
                        {deal.value && (
                            <p className="flex items-center gap-1 text-muted-foreground text-xs">
                                <DollarSign className="h-3 w-3" />
                                {deal.value.toLocaleString()} {deal.currency || "USD"}
                            </p>
                        )}
                        <Badge className={statusColors[deal.status]} variant="secondary">
                            {deal.status}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                            <Link to={`/crm/deals/${deal.id}/edit` as string}>
                                <Edit className="h-3 w-3" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDelete}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface StageColumnProps {
    stage: PipelineStage;
    deals: Deal[];
    onDeleteDeal: (id: string) => void;
}

function StageColumn({ stage, deals, onDeleteDeal }: Readonly<StageColumnProps>) {
    const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

    return (
        <div className="flex min-w-[280px] flex-col rounded-lg bg-muted/50 p-3">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: stage.color || "#6b7280" }} />
                    <h3 className="font-semibold text-sm">{stage.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                        {deals.length}
                    </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </div>
            <p className="mb-3 text-muted-foreground text-xs">Total: ${totalValue.toLocaleString()}</p>
            <div className="flex-1 space-y-2">
                {deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} onDelete={onDeleteDeal} />
                ))}
            </div>
        </div>
    );
}

export function DealsKanban() {
    const { deals, pipelines, loading, error, deleteDeal } = useDeals();

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground">Loading deals...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-red-600">Failed to load deals: {error.message}</p>
            </div>
        );
    }

    const activePipeline = pipelines.find((p) => p.isDefault) || pipelines[0];

    if (!activePipeline) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-3xl tracking-tight">Deals</h1>
                        <p className="text-muted-foreground">Manage your sales pipeline</p>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>No Pipeline Found</CardTitle>
                        <CardDescription>Please create a pipeline first to manage deals.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    const handleDeleteDeal = async (id: string) => {
        try {
            await deleteDeal(id);
        } catch {
            // Error is handled in the hook
        }
    };

    const getDealsForStage = (stageId: string) => deals.filter((deal) => deal.stageId === stageId);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-3xl tracking-tight">Deals</h1>
                    <p className="text-muted-foreground">Manage your sales pipeline - {activePipeline.name}</p>
                </div>
                <Button asChild>
<Link to={"/crm/deals/new" as string}>
                    <Plus className="mr-2 h-4 w-4" />
                        New Deal
                    </Link>
                </Button>
            </div>

            {deals.length === 0 && activePipeline.stages.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            No deals found
                        </CardTitle>
                        <CardDescription>Start by adding your first deal to the pipeline</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link to={"/crm/deals/new" as string}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Deal
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="overflow-x-auto">
                    <div className="flex gap-4 pb-4">
                        {activePipeline.stages
                            .sort((a: PipelineStage, b: PipelineStage) => a.order - b.order)
                            .map((stage: PipelineStage) => (
                                <StageColumn
                                    key={stage.id}
                                    stage={stage}
                                    deals={getDealsForStage(stage.id)}
                                    onDeleteDeal={handleDeleteDeal}
                                />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}

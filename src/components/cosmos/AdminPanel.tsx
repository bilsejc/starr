import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Section } from "@/game/types";
import { TOTAL_STARS } from "@/game/defaultSections";
import { Settings, Trash2, Upload, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AdminPanelProps {
  sections: Section[];
  onUpdate: (sections: Section[]) => void;
  onReset: () => void;
}

export const AdminPanel = ({ sections, onUpdate, onReset }: AdminPanelProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Section[]>(sections);
  const fileInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) setDraft(sections);
  }, [open, sections]);

  const totalSlots = draft.reduce((sum, s) => sum + (Number(s.slots) || 0), 0);

  const updateField = (i: number, field: keyof Section, value: string | number) => {
    setDraft((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  };

  const handleImage = (i: number, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateField(i, "image", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (totalSlots !== TOTAL_STARS) {
      toast.error(`Орын саны дәл ${TOTAL_STARS} болуы керек. Қазір: ${totalSlots}`);
      return;
    }
    onUpdate(draft);
    toast.success("Баптаулар сақталды! Ойын қайта басталды.");
    setOpen(false);
  };

  const handleReset = () => {
    onReset();
    toast.success("Ойын қалпына келтірілді");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-card/40 backdrop-blur border border-border/40 text-muted-foreground/60 hover:text-primary hover:border-primary/60 hover:bg-card/80 transition-all flex items-center justify-center"
        aria-label="Әкімші баптаулары"
      >
        <Settings className="w-4 h-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-magic">Секция баптаулары</DialogTitle>
            <DialogDescription>
              Орын саны <span className={totalSlots === TOTAL_STARS ? "text-primary font-bold" : "text-destructive font-bold"}>{TOTAL_STARS}</span> болуы керек.
              Қазір: <span className="font-bold">{totalSlots}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {draft.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/40">
                <div className="w-16 h-16 rounded-lg bg-background/50 flex items-center justify-center overflow-hidden shrink-0">
                  {s.image ? (
                    <img src={s.image} alt={s.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-xs text-muted-foreground">жоқ</span>
                  )}
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-2">
                  <div>
                    <Label className="text-xs">Атауы</Label>
                    <Input
                      value={s.name}
                      onChange={(e) => updateField(i, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Орын</Label>
                    <Input
                      type="number"
                      min={0}
                      max={16}
                      value={s.slots}
                      onChange={(e) => updateField(i, "slots", Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <input
                    ref={(el) => (fileInputs.current[i] = el)}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImage(i, e.target.files?.[0])}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => fileInputs.current[i]?.click()}
                  >
                    <Upload className="w-3.5 h-3.5 mr-1" /> Сурет
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 justify-between pt-2 border-t border-border/40">
            <Button variant="destructive" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" /> Ойынды қалпына келтіру
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Болдырмау</Button>
              <Button onClick={save} className="bg-magic text-primary-foreground font-bold">Сақтау</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

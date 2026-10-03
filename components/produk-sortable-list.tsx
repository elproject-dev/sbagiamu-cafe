"use client"

import { useState } from "react"
import {
 DndContext,
 closestCenter,
 KeyboardSensor,
 PointerSensor,
 TouchSensor,
 useSensor,
 useSensors,
 DragEndEvent,
 DragOverlay,
 DragStartEvent,
} from "@dnd-kit/core"
import {
 SortableContext,
 sortableKeyboardCoordinates,
 useSortable,
 verticalListSortingStrategy,
 arrayMove,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/toast"
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table"

interface ProdukItem {
 id: number
 title: string
 price: string
 src: string
 sort_order?: number
 is_active?: boolean
}

interface SortableProps {
 produk: ProdukItem
 isSelected: boolean
 onSelect: (id: number, checked: boolean) => void
 onToggleActive: (produk: ProdukItem, checked: boolean) => void
 onEdit: (produk: ProdukItem) => void
}

function SortableMobileCard({ produk, isSelected, onSelect, onToggleActive, onEdit }: SortableProps) {
 const {
 attributes,
 listeners,
 setNodeRef,
 transform,
 transition,
 isDragging,
 } = useSortable({ id: produk.id })

 const style = {
 transform: CSS.Transform.toString(transform),
 transition,
 }

 return (
 <div
 ref={setNodeRef}
 style={style}
 className={cn(
 "bg-card-alt text-primary border border-primary/20 rounded-none p-4 flex gap-4 relative transition-all",
 isDragging ? "opacity-40 shadow-lg z-50" : "shadow-sm hover:shadow-md"
 )}
 >
 <div className="flex items-center flex-col gap-2 justify-center shrink-0">
 <button
 className="cursor-grab active:cursor-grabbing touch-none text-primary/40 hover:text-primary transition-colors"
 {...attributes}
 {...listeners}
 >
 <GripVertical className="w-5 h-5" />
 </button>
 <Checkbox
 checked={isSelected}
 onCheckedChange={(c) => onSelect(produk.id, !!c)}
 aria-label={`Select ${produk.title}`}
 />
 </div>
 <div className="w-16 h-16 shrink-0 cursor-pointer overflow-hidden rounded-none border border-primary/20" onClick={() => onEdit(produk)}>
 <img src={produk.src} alt={produk.title} className="w-full h-full object-cover" />
 </div>
 <div className="flex flex-1 flex-col justify-between min-w-0">
 <div onClick={() => onEdit(produk)} className="cursor-pointer space-y-1">
 <div className="font-semibold text-foreground truncate text-sm leading-tight">{produk.title}</div>
 <div className="text-xs text-primary/70 line-clamp-2 leading-snug">{produk.price}</div>
 </div>
 <div className="flex items-center justify-between mt-2 border-t border-primary/10 pt-2">
 <span className="text-xs text-primary/70">Status</span>
 <Switch
 checked={produk.is_active ?? true}
 onCheckedChange={(checked) => onToggleActive(produk, checked)}
 aria-label={`Toggle status ${produk.title}`}
 />
 </div>
 </div>
 </div>
 )
}

function SortableTableRow({ produk, isSelected, onSelect, onToggleActive, onEdit }: SortableProps) {
 const {
 attributes,
 listeners,
 setNodeRef,
 transform,
 transition,
 isDragging,
 } = useSortable({ id: produk.id })

 const style = {
 transform: CSS.Transform.toString(transform),
 transition,
 }

 return (
 <TableRow
 ref={setNodeRef}
 style={style}
 className={cn(
 "border-b border-zinc-100 dark:border-zinc-800/50 transition-colors group",
 isDragging ? "opacity-40 shadow-lg z-50 bg-primary-soft/20 dark:bg-primary/20 relative" : "hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50"
 )}
 >
 <TableCell className="text-center align-middle w-[40px]">
 <button
 className="cursor-grab active:cursor-grabbing touch-none text-primary/40 hover:text-primary transition-colors"
 {...attributes}
 {...listeners}
 >
 <GripVertical className="w-5 h-5 mx-auto" />
 </button>
 </TableCell>
 <TableCell className="text-center align-middle w-[50px]">
 <Checkbox
 aria-label={`Select ${produk.title}`}
 checked={isSelected}
 onCheckedChange={(c) => onSelect(produk.id, !!c)}
 />
 </TableCell>
 <TableCell className="p-3 align-middle cursor-pointer w-[100px]" onClick={() => onEdit(produk)}>
 <div className="w-14 h-14 overflow-hidden rounded-none mx-auto border border-primary/20 shadow-sm group-hover:shadow-md transition-all">
 <img src={produk.src} alt={produk.title} className="w-full h-full object-cover" />
 </div>
 </TableCell>
 <TableCell className="font-semibold text-foreground align-middle cursor-pointer" onClick={() => onEdit(produk)}>{produk.title}</TableCell>
 <TableCell className="text-primary/70 align-middle cursor-pointer" onClick={() => onEdit(produk)}>{produk.price}</TableCell>
 <TableCell className="text-center w-[120px]">
 <Switch
 checked={produk.is_active ?? true}
 onCheckedChange={(checked) => onToggleActive(produk, checked)}
 aria-label={`Toggle status ${produk.title}`}
 />
 </TableCell>
 </TableRow>
 )
}

function DragOverlayMobileCard({ produk }: { produk: ProdukItem }) {
 return (
 <div className="bg-card-alt text-primary border-2 border-primary rounded-none p-4 flex gap-4 shadow-2xl opacity-95 rotate-2">
 <div className="flex items-center flex-col gap-2 justify-center shrink-0">
 <GripVertical className="w-5 h-5 text-primary" />
 <Checkbox checked={false} disabled />
 </div>
 <div className="w-16 h-16 shrink-0 overflow-hidden rounded-none border border-primary/20">
 <img src={produk.src} alt={produk.title} className="w-full h-full object-cover" />
 </div>
 <div className="flex flex-1 flex-col justify-between min-w-0">
 <div className="space-y-1">
 <div className="font-semibold text-foreground truncate text-sm leading-tight">{produk.title}</div>
 <div className="text-xs text-primary/70 line-clamp-2 leading-snug">{produk.price}</div>
 </div>
 </div>
 </div>
 )
}

function DragOverlayTableRow({ produk }: { produk: ProdukItem }) {
 return (
 <div className="flex items-center gap-4 bg-card-alt border-2 border-primary shadow-2xl opacity-95 rotate-1 p-2">
 <GripVertical className="w-5 h-5 text-primary" />
 <div className="w-14 h-14 overflow-hidden rounded-none border border-primary/20 shadow-sm">
 <img src={produk.src} alt={produk.title} className="w-full h-full object-cover" />
 </div>
 <div className="font-semibold text-foreground">{produk.title}</div>
 </div>
 )
}

interface ProdukSortableListProps {
 produks: ProdukItem[]
 setProduks: (items: ProdukItem[]) => void
 selectedRows: number[]
 onSelect: (id: number, checked: boolean) => void
 onEdit: (produk: ProdukItem) => void
 isSavingOrder: boolean
 setIsSavingOrder: (v: boolean) => void
 onSelectAll: (checked: boolean) => void
 isAllSelected: boolean
}

export function ProdukSortableList({
 produks,
 setProduks,
 selectedRows,
 onSelect,
 onEdit,
 isSavingOrder,
 setIsSavingOrder,
 onSelectAll,
 isAllSelected,
}: ProdukSortableListProps) {
 const [activeDragId, setActiveDragId] = useState<number | null>(null)

 const sensors = useSensors(
 useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
 useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
 )

 const activeProduk = activeDragId !== null ? produks.find(p => p.id === activeDragId) : null

 const handleDragStart = (event: DragStartEvent) => {
 setActiveDragId(event.active.id as number)
 }

 const handleDragEnd = async (event: DragEndEvent) => {
 const { active, over } = event
 setActiveDragId(null)
 if (!over || active.id === over.id) return

 const oldIndex = produks.findIndex(p => p.id === active.id)
 const newIndex = produks.findIndex(p => p.id === over.id)
 const newOrder = arrayMove(produks, oldIndex, newIndex)

 setProduks(newOrder)

 setIsSavingOrder(true)
 try {
 const updates = newOrder.map((p, i) =>
 supabase.from('products').update({ sort_order: i + 1 }).eq('id', p.id)
 )
 await Promise.all(updates)
 const updatedProduks = newOrder.map((p, i) => ({ ...p, sort_order: i + 1 }))
 setProduks(updatedProduks)
 toast.add({ title: 'Urutan produk berhasil disimpan', type: 'success' })
 } catch (e: any) {
 toast.add({ title: 'Gagal menyimpan urutan', description: e.message, type: 'error' })
 } finally {
 setIsSavingOrder(false)
 }
 }

 const handleToggleActive = async (produk: ProdukItem, checked: boolean) => {
 const { error } = await supabase.from('products').update({ is_active: checked }).eq('id', produk.id)
 if (!error) {
 setProduks(produks.map(p => p.id === produk.id ? { ...p, is_active: checked } : p))
 toast.add({ title:`Status produk ${checked ? 'diaktifkan' : 'dinonaktifkan'}`, type: 'success' })
 } else {
 toast.add({ title: 'Gagal memperbarui status', description: error.message, type: 'error' })
 }
 }

 return (
 <DndContext
 sensors={sensors}
 collisionDetection={closestCenter}
 modifiers={[restrictToVerticalAxis]}
 onDragStart={handleDragStart}
 onDragEnd={handleDragEnd}
 >
 <SortableContext items={produks.map(p => p.id)} strategy={verticalListSortingStrategy}>
 
 {/* Mobile View */}
 <div className="flex flex-col gap-3 md:hidden mt-2">
 {produks.map((produk) => (
 <SortableMobileCard
 key={produk.id}
 produk={produk}
 isSelected={selectedRows.includes(produk.id)}
 onSelect={onSelect}
 onToggleActive={handleToggleActive}
 onEdit={onEdit}
 />
 ))}
 </div>

 {/* Desktop Table View */}
 <div className="hidden md:block rounded-none border border-primary/20 bg-card-alt text-primary overflow-hidden shadow-sm mt-4">
 <Table className="[&_td]:border-primary/20 dark:[&_td]:border-primary-soft/20 [&_th]:border-primary/20 dark:[&_th]:border-primary-soft/20 [&_td]:border [&_th]:border">
 <TableHeader className="bg-primary-soft dark:bg-background">
 <TableRow className="border-b border-primary/20 hover:bg-primary-soft/40 dark:hover:bg-primary/40">
 <TableHead className="w-[40px] text-center"></TableHead>
 <TableHead className="w-[50px] text-center">
 <Checkbox
 aria-label="Select all"
 checked={isAllSelected}
 onCheckedChange={onSelectAll}
 />
 </TableHead>
 <TableHead className="w-[100px] text-center font-medium">Foto</TableHead>
 <TableHead className="font-medium">Nama Produk</TableHead>
 <TableHead className="font-medium">Harga</TableHead>
 <TableHead className="text-center w-[120px] font-medium">Status</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {produks.map((produk) => (
 <SortableTableRow
 key={produk.id}
 produk={produk}
 isSelected={selectedRows.includes(produk.id)}
 onSelect={onSelect}
 onToggleActive={handleToggleActive}
 onEdit={onEdit}
 />
 ))}
 </TableBody>
 </Table>
 </div>

 </SortableContext>
 <DragOverlay>
 {activeProduk && (
 <>
 <div className="md:hidden">
 <DragOverlayMobileCard produk={activeProduk} />
 </div>
 <div className="hidden md:block">
 <DragOverlayTableRow produk={activeProduk} />
 </div>
 </>
 )}
 </DragOverlay>
 </DndContext>
 )
}

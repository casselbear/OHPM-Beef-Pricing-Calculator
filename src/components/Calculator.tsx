import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Calculator as CalcIcon, TrendingUp, TrendingDown, DollarSign, Weight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MeatCut {
  id: string;
  name: string;
  pounds: number;
  pricePerLb: number;
}

const INITIAL_CUTS: MeatCut[] = [
  { id: '1', name: 'Bones (soup, knuckle)', pounds: 5.00, pricePerLb: 3.00 },
  { id: '2', name: 'Brisket', pounds: 24.00, pricePerLb: 5.99 },
  { id: '3', name: 'Chuck Roast', pounds: 60.00, pricePerLb: 8.99 },
  { id: '4', name: 'Flank', pounds: 4.60, pricePerLb: 1.99 },
  { id: '5', name: 'Ground', pounds: 400.00, pricePerLb: 6.99 },
  { id: '6', name: 'Heart', pounds: 2.00, pricePerLb: 4.00 },
  { id: '7', name: 'Kidney Fat', pounds: 6.29, pricePerLb: 10.00 },
  { id: '8', name: 'Liver', pounds: 13.00, pricePerLb: 6.00 },
  { id: '9', name: 'Oxtail', pounds: 2.00, pricePerLb: 10.99 },
  { id: '10', name: 'Rib Roast/ Ribeye Steak', pounds: 34.80, pricePerLb: 20.99 },
  { id: '11', name: 'Shanks', pounds: 27.40, pricePerLb: 9.99 },
  { id: '12', name: 'Sirloin', pounds: 59.00, pricePerLb: 11.99 },
  { id: '13', name: 'Stew Meat', pounds: 59.00, pricePerLb: 8.99 },
  { id: '14', name: 'Strip Loin / Strip Steak', pounds: 18.00, pricePerLb: 16.99 },
  { id: '15', name: 'Tenderloin', pounds: 9.00, pricePerLb: 24.99 },
  { id: '16', name: 'Tongue', pounds: 2.00, pricePerLb: 9.99 },
  { id: '17', name: 'Top Round', pounds: 30.00, pricePerLb: 9.99 },
];

export default function Calculator() {
  const [liveWeight, setLiveWeight] = useState<number>(1400);
  const [processingCost, setProcessingCost] = useState<number>(800);
  const [animalCost, setAnimalCost] = useState<number>(3500);
  const [cuts, setCuts] = useState<MeatCut[]>(INITIAL_CUTS);

  const calculations = useMemo(() => {
    const totalDirectCost = processingCost + animalCost;
    const saleableWeight = cuts.reduce((sum, cut) => sum + cut.pounds, 0);
    const yieldPercentage = liveWeight > 0 ? (saleableWeight / liveWeight) * 100 : 0;

    const cutsWithCalculations = cuts.map(cut => {
      const pricePerAnimal = cut.pounds * cut.pricePerLb;
      return {
        ...cut,
        pricePerAnimal,
        yieldPercent: saleableWeight > 0 ? (cut.pounds / saleableWeight) * 100 : 0,
      };
    });

    const totalRetailPrice = cutsWithCalculations.reduce((sum, cut) => sum + cut.pricePerAnimal, 0);

    const finalCuts = cutsWithCalculations.map(cut => {
      const percentOfTotalPrice = totalRetailPrice > 0 ? (cut.pricePerAnimal / totalRetailPrice) : 0;
      const totalDollarOfCost = percentOfTotalPrice * totalDirectCost;
      const cogs = cut.pounds > 0 ? totalDollarOfCost / cut.pounds : 0;
      return {
        ...cut,
        percentOfTotalPrice: percentOfTotalPrice * 100,
        totalDollarOfCost,
        cogs,
      };
    });

    const profitLoss = totalRetailPrice - totalDirectCost;

    return {
      totalDirectCost,
      saleableWeight,
      yieldPercentage,
      totalRetailPrice,
      profitLoss,
      cuts: finalCuts,
    };
  }, [liveWeight, processingCost, animalCost, cuts]);

  const handleUpdateCut = (id: string, field: keyof MeatCut, value: string | number) => {
    setCuts(prev => prev.map(cut => {
      if (cut.id === id) {
        return { ...cut, [field]: value };
      }
      return cut;
    }));
  };

  const handleAddCut = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setCuts(prev => [...prev, { id: newId, name: 'New Cut', pounds: 0, pricePerLb: 0 }]);
  };

  const handleRemoveCut = (id: string) => {
    setCuts(prev => prev.filter(cut => cut.id !== id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatPercent = (value: number) => {
    return value.toFixed(2) + '%';
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 tk-brandon-grotesque">
      <div className="flex flex-col gap-8">
        {/* Input Section */}
        <Card className="border-neutral-200 bg-white shadow-sm overflow-hidden py-0 gap-0 rounded-none">
          <CardHeader className="bg-neutral-800 text-white px-6 py-4 rounded-none border-b-0">
            <CardTitle className="flex items-center gap-2">
              <CalcIcon className="w-5 h-5" />
              Animal & Processing
            </CardTitle>
            <CardDescription className="text-white/60">
              Enter the base costs and weights for your animal.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="liveWeight" className="text-foreground font-bold uppercase tracking-wider text-xs">Live Weight (Pounds)</Label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    id="liveWeight"
                    type="number"
                    step="any"
                    value={liveWeight}
                    onChange={(e) => setLiveWeight(Number(e.target.value))}
                    className="pl-10 border-neutral-200 focus-visible:ring-brand-red"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="animalCost" className="text-foreground font-bold uppercase tracking-wider text-xs">Animal Cost ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    id="animalCost"
                    type="number"
                    step="any"
                    value={animalCost}
                    onChange={(e) => setAnimalCost(Number(e.target.value))}
                    className="pl-10 border-neutral-200 focus-visible:ring-brand-red"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="processingCost" className="text-foreground font-bold uppercase tracking-wider text-xs">Processing Cost ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    id="processingCost"
                    type="number"
                    step="any"
                    value={processingCost}
                    onChange={(e) => setProcessingCost(Number(e.target.value))}
                    className="pl-10 border-neutral-200 focus-visible:ring-brand-red"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-neutral-100" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-neutral-50 rounded-none border border-neutral-100">
                <p className="text-xs text-foreground/60 uppercase font-bold tracking-wider">Total Direct Cost</p>
                <p className="text-xl font-bold text-foreground">{formatCurrency(calculations.totalDirectCost)}</p>
              </div>
              <div className="p-3 bg-neutral-50 rounded-none border border-neutral-100">
                <p className="text-xs text-foreground/60 uppercase font-bold tracking-wider">Saleable Weight</p>
                <p className="text-xl font-bold text-foreground">{calculations.saleableWeight.toFixed(2)} lbs</p>
              </div>
              <div className="p-3 bg-neutral-50 rounded-none border border-neutral-100">
                <p className="text-xs text-foreground/60 uppercase font-bold tracking-wider">% Yield (Saleable/Live)</p>
                <p className="text-xl font-bold text-foreground">{formatPercent(calculations.yieldPercentage)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cuts Table Section */}
        <Card className="border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col py-0 gap-0 rounded-none">
          <CardHeader className="bg-neutral-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 rounded-none border-b-0 gap-4">
            <div className="w-full">
              <CardTitle>Meat Cuts & Pricing</CardTitle>
              <CardDescription className="text-white/60">
                Adjust pounds and retail prices for each cut.
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                onClick={handleAddCut} 
                variant="outline" 
                className="flex-1 md:flex-none bg-brand-red hover:bg-brand-red/90 border-none text-white font-bold rounded-none"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Cut
              </Button>
              <Button 
                onClick={() => setCuts(INITIAL_CUTS)} 
                variant="outline" 
                className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-none"
              >
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Table>
              <TableHeader className="bg-neutral-50">
                <TableRow className="hover:bg-transparent border-neutral-200">
                    <TableHead className="text-foreground font-bold w-[200px] uppercase tracking-wider text-xs">Cut Name</TableHead>
                    <TableHead className="text-foreground font-bold text-right uppercase tracking-wider text-xs">Pounds</TableHead>
                    <TableHead className="text-foreground font-bold text-right uppercase tracking-wider text-xs">Price/Lb</TableHead>
                    <TableHead className="text-foreground font-bold text-right uppercase tracking-wider text-xs">Price/Animal</TableHead>
                    <TableHead className="text-foreground font-bold text-right uppercase tracking-wider text-xs">COGS</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {calculations.cuts.map((cut) => (
                      <motion.tr
                        key={cut.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group border-neutral-100 hover:bg-neutral-50 transition-colors"
                      >
                        <TableCell className="p-2">
                          <Input
                            value={cut.name}
                            onChange={(e) => handleUpdateCut(cut.id, 'name', e.target.value)}
                            className="h-9 border-neutral-200 focus-visible:ring-brand-red bg-white rounded-none"
                          />
                        </TableCell>
                        <TableCell className="p-2 text-right">
                          <Input
                            type="number"
                            step="any"
                            value={cut.pounds}
                            onChange={(e) => handleUpdateCut(cut.id, 'pounds', Number(e.target.value))}
                            className="h-9 w-24 ml-auto text-right border-neutral-200 focus-visible:ring-brand-red bg-white rounded-none"
                          />
                        </TableCell>
                        <TableCell className="p-2 text-right">
                          <Input
                            type="number"
                            step="any"
                            value={cut.pricePerLb}
                            onChange={(e) => handleUpdateCut(cut.id, 'pricePerLb', Number(e.target.value))}
                            className="h-9 w-24 ml-auto text-right border-neutral-200 focus-visible:ring-brand-red bg-white rounded-none"
                          />
                        </TableCell>
                        <TableCell className="p-2 text-right font-medium text-foreground">
                          {formatCurrency(cut.pricePerAnimal)}
                        </TableCell>
                        <TableCell className="p-2 text-right text-neutral-500 text-sm">
                          {formatCurrency(cut.cogs)}
                        </TableCell>
                        <TableCell className="p-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCut(cut.id)}
                            className="h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-none"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
          </CardContent>
          <div className="bg-neutral-800 text-white p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 gap-6 md:gap-0">
              <div className="text-left w-full md:w-auto">
                <p className="text-xs text-white/60 uppercase font-bold tracking-wider">Total Retail Value</p>
                <p className="text-3xl font-bold">{formatCurrency(calculations.totalRetailPrice)}</p>
              </div>
              <div className="text-left md:text-right w-full md:w-auto">
                <p className="text-xs text-white/60 uppercase font-bold tracking-wider">
                  {calculations.profitLoss >= 0 ? 'Estimated Profit' : 'Estimated Loss'}
                </p>
                <div className="flex items-center justify-start md:justify-end gap-2">
                  {calculations.profitLoss >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-brand-red" />
                  )}
                  <p className={`text-3xl font-bold ${calculations.profitLoss >= 0 ? 'text-green-500' : 'text-brand-red'}`}>
                    {formatCurrency(calculations.profitLoss)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

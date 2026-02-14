
import Link from 'next/link';
import { Calculator, ArrowRight } from 'lucide-react';

export function BlogCTA() {
    return (
        <div className="my-16 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-black border border-white/10 rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="bg-blue-500/10 p-4 rounded-full text-blue-400">
                    <Calculator size={32} />
                </div>
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">How much is manual work costing you?</h3>
                    <p className="text-neutral-400">
                        Stop guessing. Use our AI ROI Calculator to see exactly how much you can save by automating core workflows.
                    </p>
                </div>
                <Link
                    href="/tools/roi-calculator"
                    className="bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-neutral-200 transition-all flex items-center gap-2"
                >
                    Calculate Savings <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}

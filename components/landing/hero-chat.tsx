'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send, ChevronLeft, ChevronRight, Sparkles, MessageCircle, X, Target } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { InlineQuizMessage } from '@/components/study/InlineQuizMessage';
import { useDemoQuiz } from '@/hooks/useDemoQuiz';

interface DemoMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SuggestionBubble {
  id: number;
  text: string;
}

interface SuggestionSet {
  setName: string;
  suggestions: SuggestionBubble[];
}

interface Trade {
  name: string;
  suggestions?: SuggestionBubble[];
  suggestionSets?: SuggestionSet[];
}

interface Sector {
  name: string;
  trades: Trade[];
}

// All Red Seal trades organized by official sectors (matches trade_specializations table)
const sectors: Sector[] = [
  {
    name: 'Construction',
    trades: [
      {
        name: 'Boilermaker',
        suggestions: [
          { id: 1, text: 'Explain boiler tube expansion techniques' },
          { id: 2, text: 'What are the safety procedures for confined spaces?' },
          { id: 3, text: 'What are common welding defects to avoid?' },
          { id: 4, text: 'How do I calculate boiler efficiency?' },
        ],
      },
      {
        name: 'Bricklayer',
        suggestions: [
          { id: 1, text: 'What is the correct mortar mix ratio?' },
          { id: 2, text: 'Explain different bond patterns' },
          { id: 3, text: 'How do I repair cracked masonry?' },
          { id: 4, text: 'How do I calculate wall quantities?' },
        ],
      },
      {
        name: 'Cabinetmaker',
        suggestions: [
          { id: 1, text: 'Explain dado joint construction' },
          { id: 2, text: 'What are the wood grain directions?' },
          { id: 3, text: 'What tools do I need for precision joinery?' },
          { id: 4, text: 'How do I calculate board feet?' },
        ],
      },
      {
        name: 'Carpenter',
        suggestions: [
          { id: 1, text: 'Explain rafter layout calculations' },
          { id: 2, text: 'What are the stair building code requirements?' },
          { id: 3, text: 'What are the building code updates for 2024?' },
          { id: 4, text: 'How do I read construction blueprints?' },
        ],
      },
      {
        name: 'Concrete Finisher',
        suggestions: [
          { id: 1, text: 'What is the correct water-cement ratio?' },
          { id: 2, text: 'Explain concrete curing methods' },
          { id: 3, text: 'How do I prevent concrete cracking?' },
          { id: 4, text: 'How do I calculate slump test results?' },
        ],
      },
      {
        name: 'Construction Craft Worker',
        suggestions: [
          { id: 1, text: 'Explain scaffolding safety requirements' },
          { id: 2, text: 'What are the rigging hand signals?' },
          { id: 3, text: 'What PPE is required for this job site?' },
          { id: 4, text: 'How do I read site layout plans?' },
        ],
      },
      {
        name: 'Construction Electrician',
        suggestions: [
          { id: 1, text: 'Explain three-phase power calculations' },
          { id: 2, text: 'What are the CEC wire ampacity rules?' },
          { id: 3, text: 'Troubleshoot: motor runs but no load response' },
          { id: 4, text: 'How do I size electrical panels?' },
        ],
      },
      {
        name: 'Drywall Finisher and Plasterer',
        suggestions: [
          { id: 1, text: 'Explain the levels of drywall finish' },
          { id: 2, text: 'What are the joint compound types?' },
          { id: 3, text: 'How do I fix bubbles in joint compound?' },
          { id: 4, text: 'How do I repair damaged drywall?' },
        ],
      },
      {
        name: 'Floorcovering Installer',
        suggestions: [
          { id: 1, text: 'Explain subfloor moisture testing' },
          { id: 2, text: 'What are the adhesive open times?' },
          { id: 3, text: 'What causes vinyl flooring to lift?' },
          { id: 4, text: 'How do I calculate flooring quantities?' },
        ],
      },
      {
        name: 'Gasfitter - Class A',
        suggestions: [
          { id: 1, text: 'Explain gas pressure testing procedures' },
          { id: 2, text: 'What are the venting requirements?' },
          { id: 3, text: 'What changed in the latest gas code update?' },
          { id: 4, text: 'How do I size gas piping?' },
        ],
      },
      {
        name: 'Gasfitter - Class B',
        suggestions: [
          { id: 1, text: 'Explain appliance installation requirements' },
          { id: 2, text: 'What are the clearance to combustibles?' },
          { id: 3, text: 'When do I need a gas permit?' },
          { id: 4, text: 'How do I test for gas leaks?' },
        ],
      },
      {
        name: 'Glazier',
        suggestions: [
          { id: 1, text: 'Explain glass tempering process' },
          { id: 2, text: 'What are the glazing compound types?' },
          { id: 3, text: 'How do I install impact-resistant glass?' },
          { id: 4, text: 'How do I calculate glass thickness?' },
        ],
      },
      {
        name: 'Insulator (Heat and Frost)',
        suggestions: [
          { id: 1, text: 'Explain R-value calculations' },
          { id: 2, text: 'What are the vapor barrier requirements?' },
          { id: 3, text: 'What insulation works best in humid climates?' },
          { id: 4, text: 'How do I calculate heat loss?' },
        ],
      },
      {
        name: 'Ironworker (Generalist)',
        suggestions: [
          { id: 1, text: 'Explain structural steel connections' },
          { id: 2, text: 'What are the rigging safety factors?' },
          { id: 3, text: 'What are safe rigging practices for heavy loads?' },
          { id: 4, text: 'How do I read structural drawings?' },
        ],
      },
      {
        name: 'Ironworker (Reinforcing)',
        suggestions: [
          { id: 1, text: 'Explain rebar placement requirements' },
          { id: 2, text: 'What are the concrete cover specifications?' },
          { id: 3, text: 'How do I calculate rebar lap lengths?' },
          { id: 4, text: 'How do I calculate rebar quantities?' },
        ],
      },
      {
        name: 'Ironworker (Structural/Ornamental)',
        suggestions: [
          { id: 1, text: 'Explain bolt torque specifications' },
          { id: 2, text: 'What are the crane hand signals?' },
          { id: 3, text: 'What are the OSHA fall protection rules?' },
          { id: 4, text: 'How do I plumb and align columns?' },
        ],
      },
      {
        name: 'Lather (Interior Systems Mechanic)',
        suggestions: [
          { id: 1, text: 'Explain metal stud framing layout' },
          { id: 2, text: 'What are the ceiling grid systems?' },
          { id: 3, text: 'How do I install EIFS correctly?' },
          { id: 4, text: 'How do I install fire-rated assemblies?' },
        ],
      },
      {
        name: 'Painter and Decorator',
        suggestions: [
          { id: 1, text: 'Explain surface preparation techniques' },
          { id: 2, text: 'What are the paint coverage rates?' },
          { id: 3, text: 'How do I match existing paint colors?' },
          { id: 4, text: 'How do I mix custom paint colors?' },
        ],
      },
      {
        name: 'Plumber',
        suggestions: [
          { id: 1, text: 'Explain drain-waste-vent systems' },
          { id: 2, text: 'What are the fixture unit calculations?' },
          { id: 3, text: 'What causes low water pressure?' },
          { id: 4, text: 'How do I size water supply piping?' },
        ],
      },
      {
        name: 'Powerline Technician',
        suggestions: [
          { id: 1, text: 'Explain transformer connections' },
          { id: 2, text: 'What are the minimum approach distances?' },
          { id: 3, text: 'What are the arc flash safety requirements?' },
          { id: 4, text: 'How do I calculate voltage drop?' },
        ],
      },
      {
        name: 'Refrigeration and Air Conditioning Mechanic',
        suggestions: [
          { id: 1, text: 'Explain the refrigeration cycle' },
          { id: 2, text: 'What are the superheat calculations?' },
          { id: 3, text: 'Troubleshoot: AC running but not cooling' },
          { id: 4, text: 'How do I size HVAC equipment?' },
        ],
      },
      {
        name: 'Roofer',
        suggestions: [
          { id: 1, text: 'Explain roof slope calculations' },
          { id: 2, text: 'What are the underlayment requirements?' },
          { id: 3, text: 'How do I prevent roof leaks around chimneys?' },
          { id: 4, text: 'How do I calculate roofing squares?' },
        ],
      },
      {
        name: 'Sheet Metal Worker',
        suggestions: [
          { id: 1, text: 'Explain duct sizing calculations' },
          { id: 2, text: 'What are the seam and joint types?' },
          { id: 3, text: 'How do I fabricate round duct transitions?' },
          { id: 4, text: 'How do I calculate air velocity?' },
        ],
      },
      {
        name: 'Sprinkler System Installer',
        suggestions: [
          { id: 1, text: 'Explain hydraulic calculations' },
          { id: 2, text: 'What are the sprinkler head types?' },
          { id: 3, text: 'What spacing do I need for sprinkler heads?' },
          { id: 4, text: 'How do I design a sprinkler system?' },
        ],
      },
      {
        name: 'Steamfitter/Pipefitter',
        suggestions: [
          { id: 1, text: 'Explain pipe bending calculations' },
          { id: 2, text: 'What are the welding procedures?' },
          { id: 3, text: 'How do I diagnose steam trap failures?' },
          { id: 4, text: 'How do I calculate pipe expansion?' },
        ],
      },
      {
        name: 'Tilesetter',
        suggestions: [
          { id: 1, text: 'Explain thin-set mortar types' },
          { id: 2, text: 'What are the substrate preparation requirements?' },
          { id: 3, text: 'How do I prevent tile lippage?' },
          { id: 4, text: 'How do I layout tile patterns?' },
        ],
      },
    ],
  },
  {
    name: 'Motive Power',
    trades: [
      {
        name: 'Agricultural Equipment Technician',
        suggestions: [
          { id: 1, text: 'Explain hydraulic system diagnostics' },
          { id: 2, text: 'What are the PTO safety procedures?' },
          { id: 3, text: "Troubleshoot: tractor won't start in cold weather" },
          { id: 4, text: 'How do I calibrate GPS systems?' },
        ],
      },
      {
        name: 'Auto Body and Collision Technician',
        suggestions: [
          { id: 1, text: 'Explain panel alignment techniques' },
          { id: 2, text: 'What are the welding procedures for HSS?' },
          { id: 3, text: 'How do I straighten frame damage safely?' },
          { id: 4, text: 'How do I measure frame damage?' },
        ],
      },
      {
        name: 'Automotive Refinishing Technician',
        suggestions: [
          { id: 1, text: 'Explain color matching techniques' },
          { id: 2, text: 'What are the spray gun settings?' },
          { id: 3, text: 'How do I prevent orange peel in clear coat?' },
          { id: 4, text: 'How do I mix paint formulas?' },
        ],
      },
      {
        name: 'Automotive Service Technician',
        suggestions: [
          { id: 1, text: 'How do I diagnose a misfire?' },
          { id: 2, text: 'Explain ABS system operation' },
          { id: 3, text: 'Troubleshoot: check engine light keeps coming back' },
          { id: 4, text: 'What causes OBD-II codes?' },
        ],
      },
      {
        name: 'Heavy Equipment Technician',
        suggestionSets: [
          {
            setName: 'Hydraulics & Safety',
            suggestions: [
              { id: 1, text: 'How do I use the emergency stop signal feature?' },
              { id: 2, text: 'Explain hydraulic system pressure testing' },
              { id: 3, text: 'What causes hydraulic pump cavitation?' },
              { id: 4, text: 'How do I test hydraulic cylinder seals?' },
            ],
          },
          {
            setName: 'Practice Quizzes',
            suggestions: [
              { id: 1, text: 'Give me a 5-question quiz on hydraulic systems' },
              { id: 2, text: 'Give me practice questions on safety procedures' },
              { id: 3, text: 'Test my knowledge on transmission components' },
              { id: 4, text: 'Give me a Block B practice exam' },
            ],
          },
          {
            setName: 'Engine Diagnostics',
            suggestions: [
              { id: 1, text: 'Explain the diesel combustion cycle' },
              { id: 2, text: 'What causes diesel engine white smoke?' },
              { id: 3, text: 'What are common fuel injection problems?' },
              { id: 4, text: 'How do I diagnose coolant system issues?' },
            ],
          },
          {
            setName: 'Transmission & Drivetrain',
            suggestions: [
              { id: 1, text: 'What are the symptoms of a failing torque converter?' },
              { id: 2, text: 'Explain differential lock operation' },
              { id: 3, text: 'Explain final drive maintenance procedures' },
              { id: 4, text: 'How do I read hydraulic schematics?' },
            ],
          },
        ],
      },
      {
        name: 'Heavy Equipment Operator',
        suggestions: [
          { id: 1, text: 'Explain grade control systems for dozers' },
          { id: 2, text: 'What are excavator swing radius hazards?' },
          { id: 3, text: 'What are daily equipment inspection points?' },
          { id: 4, text: 'How do I calculate cut and fill volumes?' },
        ],
      },
      {
        name: 'Mobile Crane Operator',
        suggestions: [
          { id: 1, text: 'Explain load chart calculations' },
          { id: 2, text: 'What are the rigging safety factors?' },
          { id: 3, text: 'How do I set up outriggers on uneven ground?' },
          { id: 4, text: 'How do I calculate lift radius?' },
        ],
      },
      {
        name: 'Motorcycle Technician',
        suggestions: [
          { id: 1, text: 'Explain carburetor synchronization' },
          { id: 2, text: 'What are the valve adjustment procedures?' },
          { id: 3, text: "Troubleshoot: bike cranks but won't start" },
          { id: 4, text: 'How do I diagnose charging issues?' },
        ],
      },
      {
        name: 'Parts Technician',
        suggestions: [
          { id: 1, text: 'Explain inventory management systems' },
          { id: 2, text: 'What are the parts cataloging methods?' },
          { id: 3, text: 'How do I find parts for older equipment?' },
          { id: 4, text: 'How do I cross-reference parts?' },
        ],
      },
      {
        name: 'Recreation Vehicle Service Technician',
        suggestions: [
          { id: 1, text: 'Explain LP gas system testing' },
          { id: 2, text: 'What are the 12V/120V system diagnostics?' },
          { id: 3, text: 'Troubleshoot: water pump runs but no pressure' },
          { id: 4, text: 'How do I troubleshoot slide-outs?' },
        ],
      },
      {
        name: 'Tower Crane Operator',
        suggestions: [
          { id: 1, text: 'Explain moment calculations' },
          { id: 2, text: 'What are the wind speed limitations?' },
          { id: 3, text: 'What are weather shutdown procedures?' },
          { id: 4, text: 'How do I calculate counterweight requirements?' },
        ],
      },
      {
        name: 'Transport Trailer Technician',
        suggestions: [
          { id: 1, text: 'Explain air brake system testing' },
          { id: 2, text: 'What are the suspension inspection points?' },
          { id: 3, text: 'Troubleshoot: trailer brakes locking up' },
          { id: 4, text: 'How do I diagnose ABS faults?' },
        ],
      },
      {
        name: 'Truck and Transport Mechanic',
        suggestions: [
          { id: 1, text: 'Explain air brake adjustment procedures' },
          { id: 2, text: 'What are the diesel engine diagnostics?' },
          { id: 3, text: 'Troubleshoot: DPF keeps regenerating' },
          { id: 4, text: 'How do I troubleshoot aftertreatment systems?' },
        ],
      },
    ],
  },
  {
    name: 'Industrial',
    trades: [
      {
        name: 'Industrial Electrician',
        suggestions: [
          { id: 1, text: 'Explain PLC programming basics' },
          { id: 2, text: 'What are the motor starter types?' },
          { id: 3, text: 'How do I program a basic PLC ladder logic?' },
          { id: 4, text: 'How do I troubleshoot VFDs?' },
        ],
      },
      {
        name: 'Industrial Mechanic (Millwright)',
        suggestions: [
          { id: 1, text: 'How do I align a coupling?' },
          { id: 2, text: 'Explain bearing failure analysis' },
          { id: 3, text: 'What causes machinery vibration issues?' },
          { id: 4, text: 'What are the rigging safety rules?' },
        ],
      },
      {
        name: 'Instrumentation and Control Technician',
        suggestions: [
          { id: 1, text: 'Explain 4-20mA loop calibration' },
          { id: 2, text: 'What are the P&ID symbols?' },
          { id: 3, text: 'How do I calibrate a pressure transmitter?' },
          { id: 4, text: 'How do I tune a PID controller?' },
        ],
      },
      {
        name: 'Machinist',
        suggestions: [
          { id: 1, text: 'Explain cutting speed calculations' },
          { id: 2, text: 'What are the GD&T symbols?' },
          { id: 3, text: 'How do I prevent tool chatter in CNC?' },
          { id: 4, text: 'How do I select cutting tools?' },
        ],
      },
      {
        name: 'Metal Fabricator (Fitter)',
        suggestions: [
          { id: 1, text: 'Explain welding symbol interpretation' },
          { id: 2, text: 'What are the layout techniques?' },
          { id: 3, text: 'How do I prevent warping when welding?' },
          { id: 4, text: 'How do I calculate bend allowance?' },
        ],
      },
      {
        name: 'Tool and Die Maker',
        suggestions: [
          { id: 1, text: 'Explain die clearance calculations' },
          { id: 2, text: 'What are the heat treatment processes?' },
          { id: 3, text: 'What tolerances are required for stamping dies?' },
          { id: 4, text: 'How do I design progressive dies?' },
        ],
      },
      {
        name: 'Welder',
        suggestions: [
          { id: 1, text: 'Explain welding position techniques' },
          { id: 2, text: 'What are the common weld defects?' },
          { id: 3, text: 'What causes porosity in welds?' },
          { id: 4, text: 'How do I select filler metals?' },
        ],
      },
      {
        name: 'Rig Technician',
        suggestions: [
          { id: 1, text: 'Explain drilling rig components' },
          { id: 2, text: 'What are the well control procedures?' },
          { id: 3, text: 'What are emergency shutdown procedures?' },
          { id: 4, text: 'How do I maintain BOP equipment?' },
        ],
      },
    ],
  },
  {
    name: 'Service',
    trades: [
      {
        name: 'Appliance Service Technician',
        suggestions: [
          { id: 1, text: 'Explain refrigeration cycle diagnostics' },
          { id: 2, text: 'What are the electrical safety procedures?' },
          { id: 3, text: "Troubleshoot: dryer runs but doesn't heat" },
          { id: 4, text: 'How do I diagnose control boards?' },
        ],
      },
      {
        name: 'Baker',
        suggestions: [
          { id: 1, text: 'Explain fermentation processes' },
          { id: 2, text: 'What are the bread formula ratios?' },
          { id: 3, text: 'Why did my bread not rise properly?' },
          { id: 4, text: 'How do I scale recipes?' },
        ],
      },
      {
        name: 'Cook',
        suggestions: [
          { id: 1, text: 'Explain food safety temperatures' },
          { id: 2, text: 'What are the mother sauces?' },
          { id: 3, text: 'What are food safety best practices?' },
          { id: 4, text: 'How do I calculate food costs?' },
        ],
      },
      {
        name: 'Hairstylist',
        suggestions: [
          { id: 1, text: 'Explain color theory and formulation' },
          { id: 2, text: 'What are the cutting techniques?' },
          { id: 3, text: 'How do I fix over-processed hair?' },
          { id: 4, text: 'How do I consult with clients?' },
        ],
      },
      {
        name: 'Landscape Horticulturist',
        suggestions: [
          { id: 1, text: 'Explain plant identification methods' },
          { id: 2, text: 'What are the soil amendment types?' },
          { id: 3, text: 'What plants thrive in shade gardens?' },
          { id: 4, text: 'How do I design irrigation systems?' },
        ],
      },
      {
        name: 'Oil Heat System Technician',
        suggestions: [
          { id: 1, text: 'Explain combustion efficiency testing' },
          { id: 2, text: 'What are the fuel pump adjustments?' },
          { id: 3, text: 'Troubleshoot: furnace runs but no heat' },
          { id: 4, text: 'How do I diagnose no-heat calls?' },
        ],
      },
    ],
  },
];

interface HeroChatProps {
  showCTAButtons?: boolean;
}

export function HeroChat({ showCTAButtons = true }: HeroChatProps) {
  const router = useRouter();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [input, setInput] = useState('');
  const [highlightedSectorIndex, setHighlightedSectorIndex] = useState(0);
  const [activeSet, setActiveSet] = useState(0);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Cycle through sectors with highlight animation (only when no sector selected)
  useEffect(() => {
    if (selectedSector) return; // Stop animation if user selects a sector

    const interval = setInterval(() => {
      setHighlightedSectorIndex((prev) => (prev + 1) % sectors.length);
    }, 2000); // Change highlighted sector every 2 seconds

    return () => clearInterval(interval);
  }, [selectedSector]);

  // Demo chat state
  const [showDemoChat, setShowDemoChat] = useState(false);
  const [demoMessages, setDemoMessages] = useState<DemoMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [demoLimitReached, setDemoLimitReached] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [demoInteractions, setDemoInteractions] = useState(0);

  // Demo quiz state
  const {
    quiz: demoQuiz,
    currentFeedback: demoQuizFeedback,
    isGenerating: isGeneratingQuiz,
    startQuiz: startDemoQuiz,
    submitAnswer: submitDemoAnswer,
    nextQuestion: nextDemoQuestion,
    resetQuiz: resetDemoQuiz,
  } = useDemoQuiz();

  // Reset chat when trade changes
  useEffect(() => {
    if (selectedTrade) {
      // Clear chat state when switching trades
      setShowDemoChat(false);
      setDemoMessages([]);
      setStreamingResponse('');
      setDemoInteractions(0);
      setDemoLimitReached(false);
      resetDemoQuiz();
      setActiveSet(0);
      setActiveSuggestion(0);
    }
  }, [selectedTrade?.name, resetDemoQuiz]);

  // Rotate through individual suggestions within the current set (3 second intervals)
  useEffect(() => {
    if (!selectedTrade || isHovering) return;

    const interval = setInterval(() => {
      setActiveSuggestion((prev) => (prev + 1) % 4); // Always 4 suggestions per set
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedTrade, isHovering]);

  // Rotate through suggestion SETS when not hovering (12 second intervals = 3s × 4 bubbles)
  useEffect(() => {
    if (!selectedTrade || isHovering) return;

    const interval = setInterval(() => {
      setActiveSet((prev) => {
        const totalSets = selectedTrade.suggestionSets?.length || 1;
        return (prev + 1) % totalSets;
      });
      setActiveSuggestion(0); // Reset to first suggestion when set changes
    }, 12000); // Change set every 12 seconds

    return () => clearInterval(interval);
  }, [selectedTrade, isHovering]);

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  // Navigation for suggestion bubbles
  const handlePrevSuggestion = () => {
    const totalSets = selectedTrade?.suggestionSets?.length || 1;
    const suggestionsPerSet = 4;

    if (activeSuggestion > 0) {
      setActiveSuggestion(prev => prev - 1);
    } else if (totalSets > 1) {
      // Go to previous set, last suggestion
      setActiveSet(prev => (prev - 1 + totalSets) % totalSets);
      setActiveSuggestion(suggestionsPerSet - 1);
    } else {
      // Wrap to last suggestion in current set
      setActiveSuggestion(suggestionsPerSet - 1);
    }
  };

  const handleNextSuggestion = () => {
    const totalSets = selectedTrade?.suggestionSets?.length || 1;
    const suggestionsPerSet = 4;

    if (activeSuggestion < suggestionsPerSet - 1) {
      setActiveSuggestion(prev => prev + 1);
    } else if (totalSets > 1) {
      // Go to next set, first suggestion
      setActiveSet(prev => (prev + 1) % totalSets);
      setActiveSuggestion(0);
    } else {
      // Wrap to first suggestion
      setActiveSuggestion(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setShowDemoChat(true);
    setIsLoading(true);
    setStreamingResponse('');

    // Add user message to chat
    const newMessages: DemoMessage[] = [...demoMessages, { role: 'user', content: userMessage }];
    setDemoMessages(newMessages);

    try {
      const response = await fetch('/api/demo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          trade: selectedTrade?.name,
        }),
      });

      // Check if demo limit reached
      if (response.status === 402) {
        const data = await response.json();
        setDemoLimitReached(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          // Parse SSE data
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              // Text chunk from AI SDK - properly parse JSON string to unescape \n etc.
              try {
                const jsonStr = line.slice(2);
                const text = JSON.parse(jsonStr);
                fullResponse += text;
                setStreamingResponse(fullResponse);
              } catch {
                // Fallback if JSON parse fails
                const text = line.slice(2).replace(/^"|"$/g, '');
                fullResponse += text;
                setStreamingResponse(fullResponse);
              }
            }
          }
        }
      }

      // Add assistant message when complete
      if (fullResponse) {
        setDemoMessages([...newMessages, { role: 'assistant', content: fullResponse }]);
        setDemoInteractions(prev => prev + 1);
        // Don't auto-trigger quiz - let user click the "Try a Quiz" button
      }
    } catch (error) {
      console.error('Demo chat error:', error);
      setDemoMessages([
        ...newMessages,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again!' }
      ]);
    } finally {
      setIsLoading(false);
      setStreamingResponse('');
    }
  };

  const handleBack = () => {
    if (selectedTrade) {
      setSelectedTrade(null);
      setActiveSet(0);
    } else if (selectedSector) {
      setSelectedSector(null);
    }
  };

  const currentSector = sectors.find(s => s.name === selectedSector);

  // Get current suggestions - either from sets or fallback to old structure
  const currentSuggestions = selectedTrade?.suggestionSets
    ? selectedTrade.suggestionSets[activeSet]?.suggestions || []
    : selectedTrade?.suggestions || [];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Step 1: Sector Selection */}
      {!selectedSector && !selectedTrade && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            What are you studying for?
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {sectors.map((sector, index) => {
              const isHighlighted = index === highlightedSectorIndex;
              return (
                <Button
                  key={sector.name}
                  variant="outline"
                  size="lg"
                  onClick={() => setSelectedSector(sector.name)}
                  className={`text-sm transition-all duration-500 ease-in-out ${
                    isHighlighted
                      ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2'
                      : 'hover:bg-primary hover:text-primary-foreground hover:border-primary'
                  }`}
                >
                  {sector.name}
                  <span className={`ml-2 text-xs ${isHighlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    ({sector.trades.length})
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Trade Selection */}
      {selectedSector && !selectedTrade && currentSector && (
        <div className="text-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to sectors
          </button>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            Select your {selectedSector} trade
          </h2>
          <div className="flex flex-wrap justify-center gap-2 max-h-64 overflow-y-auto">
            {currentSector.trades.map((trade) => (
              <Button
                key={trade.name}
                variant="outline"
                size="sm"
                onClick={() => setSelectedTrade(trade)}
                className="text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
              >
                {trade.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Suggestions and Chat */}
      {selectedTrade && (
        <div className="space-y-6">
          {/* Trade Badge with back button */}
          <div className="text-center">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              {selectedTrade.name}
            </button>
          </div>

          {/* Animated Suggestion Bubbles - Individual highlights + set rotation */}
          <div
            className="relative min-h-24 flex items-center justify-center py-4"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Left Arrow */}
            <button
              onClick={handlePrevSuggestion}
              className="absolute left-0 p-2 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
              aria-label="Previous suggestion"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex flex-wrap justify-center gap-2 px-12">
              {currentSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 cursor-pointer',
                    index === activeSuggestion
                      ? 'bg-primary text-primary-foreground scale-105 shadow-lg shadow-primary/25'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 scale-95 opacity-60 hover:opacity-100'
                  )}
                >
                  {suggestion.text.length > 45
                    ? suggestion.text.substring(0, 45) + '...'
                    : suggestion.text}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNextSuggestion}
              className="absolute right-0 p-2 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
              aria-label="Next suggestion"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Tooltip hint for active suggestion */}
          {!showDemoChat && (
            <div className="text-center">
              <span className="text-xs text-muted-foreground">
                Use arrows to browse questions, click one to try it, or type your own below
              </span>
            </div>
          )}

          {/* Demo Chat Messages */}
          {showDemoChat && (
            <div className="bg-card border border-border rounded-xl p-4 max-h-80 overflow-y-auto space-y-4">
              {demoMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex gap-3',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] px-4 py-2 rounded-2xl text-sm',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p]:last:mb-0 [&_strong]:font-semibold">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {/* Streaming response */}
              {isLoading && streamingResponse && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="max-w-[80%] px-4 py-2 rounded-2xl rounded-bl-md bg-muted text-foreground text-sm">
                    <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2 [&>p]:last:mb-0 [&_strong]:font-semibold">
                      <ReactMarkdown>{streamingResponse}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading indicator */}
              {isLoading && !streamingResponse && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="px-4 py-2 rounded-2xl rounded-bl-md bg-muted">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Try a Quiz Button - shows after first AI response, before quiz starts */}
              {demoMessages.length >= 2 && !demoQuiz && !isLoading && !isGeneratingQuiz && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => startDemoQuiz(demoMessages, selectedTrade?.name)}
                    variant="outline"
                    className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Target className="h-4 w-4" />
                    Quiz Me On This
                  </Button>
                </div>
              )}

              {/* Quiz generating loading state */}
              {isGeneratingQuiz && (
                <div className="flex items-center justify-center gap-3 py-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">Generating quiz question...</span>
                </div>
              )}

              {/* Demo Inline Quiz */}
              {demoQuiz && demoQuiz.status === 'in_progress' && demoQuiz.questions[demoQuiz.currentQuestion] && (
                <InlineQuizMessage
                  question={demoQuiz.questions[demoQuiz.currentQuestion]}
                  questionNumber={demoQuiz.currentQuestion + 1}
                  totalQuestions={demoQuiz.questions.length}
                  onAnswer={submitDemoAnswer}
                  onNext={nextDemoQuestion}
                  feedback={demoQuizFeedback}
                />
              )}

              {/* Quiz completed - show signup */}
              {demoQuiz && demoQuiz.status === 'completed' && (
                <div className="text-center py-4 space-y-3 bg-card border border-border rounded-xl p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {demoQuiz.score >= 50 ? 'Nice work!' : 'Keep practicing!'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sign up to unlock unlimited quizzes, full 135-question exams, and personalized study plans.
                    </p>
                  </div>
                  {showCTAButtons && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link href={`/get-started/student${selectedTrade ? `?trade=${encodeURIComponent(selectedTrade.name)}` : ''}`}>
                        <Button size="lg" className="px-8 w-full sm:w-auto">
                          Get Started Free
                        </Button>
                      </Link>
                      <Link href="/pricing">
                        <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto">
                          View Pricing
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Demo limit reached */}
              {demoLimitReached && (
                <div className="text-center py-4 space-y-3">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Sparkles className="h-4 w-4" />
                    You've seen a taste of Red!
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign up to unlock unlimited conversations, quizzes, and exam prep.
                  </p>
                  {showCTAButtons && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link href={`/get-started/student${selectedTrade ? `?trade=${encodeURIComponent(selectedTrade.name)}` : ''}`}>
                        <Button size="lg" className="px-8 w-full sm:w-auto">
                          Get Started Free
                        </Button>
                      </Link>
                      <Link href="/pricing">
                        <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto">
                          View Pricing
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}


          {/* Chat Input */}
          {!demoLimitReached && (
            <form onSubmit={handleSubmit} className="relative">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={showDemoChat ? "Ask a follow-up question..." : "Ask your question or click a suggestion above..."}
                className="h-14 pl-6 pr-14 rounded-full text-base bg-card border-2 border-input focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* CTA Buttons - Get Started & View Pricing */}
          {showCTAButtons && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link href={`/get-started/student${selectedTrade ? `?trade=${encodeURIComponent(selectedTrade.name)}` : ''}`}>
                <Button size="lg" className="px-8 w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="px-8 w-full sm:w-auto">
                  View Pricing →
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

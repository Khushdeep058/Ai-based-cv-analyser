import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ScoreMeter from '../components/ScoreMeter';
import { ArrowLeft, CheckCircle2, XCircle,  GitBranch, Link as LinkIcon, FileText, ChevronDown, ChevronUp, Check, X, Sparkles } from 'lucide-react';

const ResultsPage = () => {
  const location = useLocation();
  const analysisData = location.state?.analysisData;
  const [isContentOpen, setIsContentOpen] = useState(true);
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const [isAtsEssentialsOpen, setIsAtsEssentialsOpen] = useState(false);
  const [isTailoringOpen, setIsTailoringOpen] = useState(false);

  if (!analysisData) {
    return (
      <div className="flex-grow pt-32 pb-24 px-6 bg-surface-container-low min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMjU2IDI1NicgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZmlsdGVyIGlkPSdub2lzZSc+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuOScgbnVtT2N0YXZlcz0nNCcgc3RpdGNoVGlsZXM9J3N0aXRjaCcvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0ndXJsKCNub2lzZSknLz48L3N2Zz4=')] opacity-[0.02]" />
        <h2 className="font-display font-bold text-3xl text-on-surface mb-4">No analysis data found.</h2>
        <Link className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-label font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all" to="/dashboard">
          <ArrowLeft size={18}/> Go back to Dashboard
        </Link>
      </div>
    );
  }

  const cvAnalysis = analysisData?.cv_analysis || analysisData || {};
  const platforms = analysisData.platforms || {};

  const score = cvAnalysis.ats_score || 0;
  const breakdown = cvAnalysis.score_breakdown || { skill_match: 0, base_parse_score: 0 };
  
  const gaps = cvAnalysis?.skill_gaps ?? [];
  const matched = cvAnalysis?.matched_skills ?? [];
  
  const recommendations = cvAnalysis.recommendations || null;
  const github = platforms.github || {};
  const linkedin = platforms.linkedin || {};

  let parsedRecs = recommendations;
  if (typeof recommendations === 'string') {
    try {
      parsedRecs = JSON.parse(recommendations);
    } catch (e) {}
  }

  // Premium Card Wrapper
  const Card = ({ children, className = "" }) => (
    <div className={`relative overflow-hidden bg-surface-container-lowest border border-outline-variant/30 rounded-[24px] p-8 shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 group ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">{children}</div>
    </div>
  );

  return (
    <div className="flex-grow pt-32 pb-24 px-6 bg-surface-container-low min-h-screen relative overflow-hidden">
      {/* Background Noise & Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMjU2IDI1NicgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZmlsdGVyIGlkPSdub2lzZSc+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuOScgbnVtT2N0YXZlcz0nNCcgc3RpdGNoVGlsZXM9J3N0aXRjaCcvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0ndXJsKCNub2lzZSknLz48L3N2Zz4=')] opacity-[0.03] mix-blend-overlay" />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-[#4ecdc4]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        <Link className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-label font-medium mb-10 transition-colors bg-surface-container-lowest/50 px-4 py-2 rounded-full border border-outline-variant/30 hover:bg-surface-container-lowest" to="/dashboard">
          <ArrowLeft size={16}/> Back to Dashboard
        </Link>
        
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-6 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Analysis Complete
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-6xl tracking-tight text-on-surface mb-4">
            Your <span className="bg-gradient-to-r from-primary via-[#9b8eff] to-[#ff6b9d] bg-clip-text text-transparent">Intelligence Report</span>
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            We've broken down your CV, LinkedIn, and GitHub exactly how recruiters and enterprise ATS systems see them. Here is your action plan.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-8">
            
            {/* ATS Match Score */}
            <Card className="flex flex-col items-center text-center">
              <h3 className="font-display font-bold text-2xl text-on-surface mb-8 w-full text-left flex items-center gap-3">
                ATS Match Score
              </h3>
              <ScoreMeter score={score}/>
              <div className="w-full mt-8 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 flex flex-col gap-4 shadow-inner">
                {Array.isArray(breakdown) ? (
                  breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant font-medium">{item.label}</span>
                      <span className="font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">+{item.value}/{item.max} pts</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant font-medium">Skill Matching</span>
                      <span className="font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">+{breakdown.skill_match || 0} pts</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant font-medium">Base Parsing (Format)</span>
                      <span className="font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">+{breakdown.base_parse_score || 0} pts</span>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Skill Architecture */}
            <Card>
              <h3 className="font-display font-bold text-2xl text-on-surface mb-8 flex items-center gap-3">
                Skill Architecture
              </h3>
              
              <div className="flex flex-col gap-8">
                <div>
                  <h4 className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-4">
                    <CheckCircle2 className="text-green-600" size={16}/> Verified Matches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matched && matched.length > 0 ? matched.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200/60 rounded-full text-sm font-medium shadow-sm">{skill}</span>
                    )) : <p className="text-sm text-on-surface-variant italic">No verified matches found.</p>}
                  </div>
                </div>

                <div className="h-px bg-outline-variant/20 w-full" />

                <div>
                  <h4 className="font-label text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-4">
                    <XCircle className="text-red-500" size={16}/> Critical Gaps
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {gaps && gaps.length > 0 ? gaps.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200/60 rounded-full text-sm font-medium shadow-sm">{skill}</span>
                    )) : <p className="text-sm text-on-surface-variant italic">No critical gaps identified.</p>}
                  </div>
                </div>
              </div>
            </Card>

            {/* Issues Breakdown Accordions */}
            <Card>
              <h3 className="font-display font-bold text-2xl text-on-surface mb-6 flex items-center gap-3">
                <FileText className="text-primary" size={24}/> Issues Breakdown
              </h3>
              
              {/* CONTENT ACCORDION */}
              <div className="border-t border-outline-variant/20 pt-4 mb-4">
                <div 
                  className="flex justify-between items-center cursor-pointer py-3 hover:opacity-80 transition-opacity"
                  onClick={() => setIsContentOpen(!isContentOpen)}
                >
                  <span className="font-label font-bold text-on-surface uppercase tracking-wider text-sm">CONTENT</span>
                  <div className="flex items-center gap-4 text-on-surface-variant">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${parsedRecs?.content_quality?.score === "100%" ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {parsedRecs?.content_quality?.score || "??%"}
                    </span>
                    <div className="p-1 bg-surface-container-low rounded-full">
                      {isContentOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </div>
                  </div>
                </div>
                
                {isContentOpen && (
                  <div className="flex flex-col gap-6 mt-4 pb-2">
                    {(() => {
                      const renderIssue = (issue) => {
                        if (typeof issue === 'string') return issue;
                        if (typeof issue === 'object' && issue !== null) {
                          const i = issue.Issue || issue.issue || 'Issue';
                          const r = issue.Recommendation || issue.recommendation || '';
                          if (issue.Issue || issue.Recommendation) return `Issue: ${i}. Recommendation: ${r}`;
                          return Object.values(issue).join(' - ');
                        }
                        return String(issue);
                      };

                      return (
                        <>
                          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/20">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2">
                                {parsedRecs?.ats_parse_rate?.status?.includes('0') ? <Check className="text-green-600 bg-green-100 p-0.5 rounded-full" size={20}/> : <X className="text-red-600 bg-red-100 p-0.5 rounded-full" size={20}/>}
                                <span className="font-bold text-on-surface">ATS Parse Rate</span>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${parsedRecs?.ats_parse_rate?.status?.includes('0') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-on-surface-variant border-outline-variant/50'}`}>
                                {parsedRecs?.ats_parse_rate?.status || "Analyzing..."}
                              </span>
                            </div>
                            <p className="text-sm text-on-surface-variant leading-relaxed">{parsedRecs?.ats_parse_rate?.feedback}</p>
                            {parsedRecs?.ats_parse_rate?.issues_list?.length > 0 && (
                              <ul className="list-disc ml-4 mt-3 text-sm text-on-surface-variant space-y-1.5">
                                {parsedRecs.ats_parse_rate.issues_list.map((issue, idx) => (
                                  <li key={idx}>{renderIssue(issue)}</li>
                                ))}
                              </ul>
                            )}
                          </div>

                          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/20">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2">
                                {parsedRecs?.content_quality?.status?.includes('0') ? <Check className="text-green-600 bg-green-100 p-0.5 rounded-full" size={20}/> : <X className="text-red-600 bg-red-100 p-0.5 rounded-full" size={20}/>}
                                <span className="font-bold text-on-surface">Quantifying Impact</span>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${parsedRecs?.content_quality?.status?.includes('0') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-on-surface-variant border-outline-variant/50'}`}>
                                {parsedRecs?.content_quality?.status || "Analyzing..."}
                              </span>
                            </div>
                            <p className="text-sm text-on-surface-variant leading-relaxed">{parsedRecs?.content_quality?.feedback}</p>
                            {parsedRecs?.content_quality?.issues_list?.length > 0 && (
                              <ul className="list-disc ml-4 mt-3 text-sm text-on-surface-variant space-y-1.5">
                                {parsedRecs.content_quality.issues_list.map((issue, idx) => (
                                  <li key={idx}>{renderIssue(issue)}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* SECTIONS ACCORDION */}
              <div className="border-t border-outline-variant/20 pt-4 mb-4">
                <div 
                  className="flex justify-between items-center cursor-pointer py-3 hover:opacity-80 transition-opacity"
                  onClick={() => setIsSectionsOpen(!isSectionsOpen)}
                >
                  <span className="font-label font-bold text-on-surface uppercase tracking-wider text-sm">SECTIONS</span>
                  <div className="flex items-center gap-4 text-on-surface-variant">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${parsedRecs?.sections?.score === "100%" ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {parsedRecs?.sections?.score || "??"}
                    </span>
                    <div className="p-1 bg-surface-container-low rounded-full">
                      {isSectionsOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </div>
                  </div>
                </div>
                {isSectionsOpen && (
                  <div className="flex flex-col gap-4 mt-4 pb-2">
                    {parsedRecs?.sections?.section_reviews?.length > 0 ? (
                      <>
                        {parsedRecs.sections.section_reviews.map((review, idx) => (
                          <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                            <strong className="text-on-surface block mb-2 font-display">
                              {review.section} <span className="text-primary font-body text-sm ml-2 px-2 py-0.5 bg-primary/10 rounded-full">{review.score}</span>
                            </strong>
                            <p className="text-sm text-on-surface-variant leading-relaxed mb-2">
                              {review.feedback}
                            </p>
                            {review.improvement && (
                              <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container p-3 rounded-lg border border-outline-variant/10">
                                <strong className="text-on-surface block mb-1 text-xs uppercase tracking-wider">Improvement</strong> {review.improvement}
                              </p>
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-sm text-on-surface-variant italic p-4">No section analysis available.</p>
                    )}
                  </div>
                )}
              </div>

              {/* ATS ESSENTIALS ACCORDION */}
              <div className="border-t border-outline-variant/20 pt-4 mb-4">
                <div 
                  className="flex justify-between items-center cursor-pointer py-3 hover:opacity-80 transition-opacity"
                  onClick={() => setIsAtsEssentialsOpen(!isAtsEssentialsOpen)}
                >
                  <span className="font-label font-bold text-on-surface uppercase tracking-wider text-sm">ATS ESSENTIALS</span>
                  <div className="flex items-center gap-4 text-on-surface-variant">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${parsedRecs?.ats_essentials?.score === "100%" ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {parsedRecs?.ats_essentials?.score || "??"}
                    </span>
                    <div className="p-1 bg-surface-container-low rounded-full">
                      {isAtsEssentialsOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </div>
                  </div>
                </div>
                {isAtsEssentialsOpen && (
                  <div className="flex flex-col gap-6 mt-4 pb-2">
                    {parsedRecs?.ats_essentials?.issues_list?.length > 0 ? (
                      <ul className="list-disc ml-5 text-sm text-on-surface-variant leading-relaxed space-y-2">
                        {parsedRecs.ats_essentials.issues_list.map((issue, idx) => (
                          <li key={idx}>
                            {typeof issue === 'string' ? issue : <><strong className="text-on-surface">{issue.Issue || 'Issue'}:</strong> {issue.Recommendation || ''}</>}
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-sm text-on-surface-variant italic p-4">No issues found with ATS Essentials!</p>}
                  </div>
                )}
              </div>

              {/* TAILORING ACCORDION */}
              <div className="border-t border-outline-variant/20 pt-4 mb-4">
                <div 
                  className="flex justify-between items-center cursor-pointer py-3 hover:opacity-80 transition-opacity"
                  onClick={() => setIsTailoringOpen(!isTailoringOpen)}
                >
                  <span className="font-label font-bold text-on-surface uppercase tracking-wider text-sm">TAILORING</span>
                  <div className="flex items-center gap-4 text-on-surface-variant">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${parsedRecs?.tailoring?.score === "100%" ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {parsedRecs?.tailoring?.score || "??"}
                    </span>
                    <div className="p-1 bg-surface-container-low rounded-full">
                      {isTailoringOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </div>
                  </div>
                </div>
                {isTailoringOpen && (
                  <div className="flex flex-col gap-6 mt-4 pb-2">
                    {parsedRecs?.tailoring?.issues_list?.length > 0 ? (
                      <ul className="list-disc ml-5 text-sm text-on-surface-variant leading-relaxed space-y-2">
                        {parsedRecs.tailoring.issues_list.map((issue, idx) => (
                          <li key={idx}>
                            {typeof issue === 'string' ? issue : <><strong className="text-on-surface">{issue.Issue || 'Issue'}:</strong> {issue.Recommendation || ''}</>}
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-sm text-on-surface-variant italic p-4">Your CV is perfectly tailored!</p>}
                  </div>
                )}
              </div>

            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-8">
            
            {/* How to Improve */}
            <Card>
              <h3 className="font-display font-bold text-2xl text-on-surface mb-6 flex items-center gap-3">
                <Sparkles className="text-primary" size={24}/> How to Improve
              </h3>
              <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 shadow-inner">
                {typeof parsedRecs === 'object' && parsedRecs !== null ? (
                  <div className="flex flex-col gap-6">
                    <p className="text-on-surface leading-relaxed m-0 font-medium">{parsedRecs.message || parsedRecs.summary || "Here are our recommended paths to boost your score:"}</p>
                    {parsedRecs.recommended_courses && parsedRecs.recommended_courses.length > 0 && (
                      <ul className="flex flex-col gap-4 m-0 p-0 list-none">
                        {parsedRecs.recommended_courses.map((course, idx) => (
                          <li key={idx} className="bg-surface-container-lowest shadow-sm border border-outline-variant/30 p-5 rounded-xl flex flex-col gap-2 hover:border-primary/30 transition-colors">
                            <strong className="text-primary text-base font-display">{course.course_name}</strong>
                            <p className="text-sm text-on-surface-variant leading-relaxed m-0">{course.reason}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="text-on-surface leading-relaxed">{String(parsedRecs)}</div>
                )}
              </div>
            </Card>

            {/* Profile Grid (LinkedIn & GitHub) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* LinkedIn Card */}
              <Card className="!p-6">
                <h3 className="font-display font-bold text-xl text-on-surface mb-6 flex items-center gap-3">
                  <LinkIcon color="#0A66C2" size={22}/> LinkedIn Health
                </h3>
                
                {(() => {
                  const score = linkedin?.linkedin_score || 0;
                  let text = "Your profile is currently a resume, not a network. Let's fix that.";
                  let color = "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]";
                  let textColor = "text-red-600";
                  let badgeBg = "bg-red-100";
                  if (score > 80) {
                    text = "Your brand is built for high-scale recruiters.";
                    color = "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]";
                    textColor = "text-green-700";
                    badgeBg = "bg-green-100";
                  } else if (score > 50) {
                    text = "Solid foundation. Let's inject some specific metrics.";
                    color = "bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]";
                    textColor = "text-orange-700";
                    badgeBg = "bg-orange-100";
                  }

                  return (
                    <div className="mb-8">
                      <div className="flex justify-between items-start gap-4 mb-3 text-sm font-medium">
                        <span className={`text-on-surface-variant leading-relaxed`}>{text}</span>
                        <span className={`${textColor} ${badgeBg} px-2.5 py-1 rounded-full font-bold whitespace-nowrap`}>{score}/100</span>
                      </div>
                      <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden shadow-inner">
                        <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  );
                })()}

                <div className="flex flex-col gap-5">
                  {linkedin?.headline_critique && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container-low inline-block w-max px-2 py-0.5 rounded">Headline Critique</span>
                      <span className="text-sm text-on-surface leading-relaxed">{linkedin.headline_critique}</span>
                    </div>
                  )}
                  {linkedin?.about_critique && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container-low inline-block w-max px-2 py-0.5 rounded">About Critique</span>
                      <span className="text-sm text-on-surface leading-relaxed">{linkedin.about_critique}</span>
                    </div>
                  )}
                  {linkedin?.quick_fixes && linkedin.quick_fixes.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Quick Fixes</span>
                      <ul className="list-disc ml-4 text-sm text-on-surface-variant leading-relaxed space-y-1">
                        {linkedin.quick_fixes.map((fix, idx) => <li key={idx}>{fix}</li>)}
                      </ul>
                    </div>
                  )}
                  {linkedin?.red_flags && linkedin.red_flags.length > 0 && (
                    <div className="flex flex-col gap-2 mt-4 p-4 bg-red-50/50 rounded-2xl border border-red-100">
                      <strong className="text-[11px] text-red-600 font-bold uppercase tracking-widest">Violations Found</strong>
                      <span className="text-sm text-red-700 leading-relaxed font-medium">{linkedin.red_flags.join(', ')}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* GitHub Card */}
              <Card className="!p-6">
                <h3 className="font-display font-bold text-xl text-on-surface mb-6 flex items-center gap-3">
                  <GitBranch className="text-on-surface" size={22}/> GitHub Metrics
                </h3>
                
                {(() => {
                  const score = github?.github_score || 0;
                  let text = "No significant GitHub presence detected.";
                  let color = "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]";
                  let textColor = "text-red-600";
                  let badgeBg = "bg-red-100";
                  if (score > 80) {
                    text = "Elite OS participation and ownership.";
                    color = "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]";
                    textColor = "text-green-700";
                    badgeBg = "bg-green-100";
                  } else if (score > 50) {
                    text = "Active developer, room for more original contributions.";
                    color = "bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]";
                    textColor = "text-orange-700";
                    badgeBg = "bg-orange-100";
                  }

                  return (
                    <div className="mb-8">
                      <div className="flex justify-between items-start gap-4 mb-3 text-sm font-medium">
                        <span className={`text-on-surface-variant leading-relaxed`}>{text}</span>
                        <span className={`${textColor} ${badgeBg} px-2.5 py-1 rounded-full font-bold whitespace-nowrap`}>{score}/100</span>
                      </div>
                      <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden shadow-inner">
                        <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  );
                })()}

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center text-sm border-b border-outline-variant/20 pb-3">
                    <span className="font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">Total Repos</span>
                    <span className="font-bold text-on-surface bg-surface-container-low px-3 py-1 rounded-full">{github?.total_repos || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-outline-variant/20 pb-3">
                    <span className="font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">Top Language</span>
                    <span className="font-bold text-on-surface bg-surface-container-low px-3 py-1 rounded-full">{github?.top_language || "N/A"}</span>
                  </div>

                  {github?.top_projects && github.top_projects.length > 0 && (
                    <div className="flex flex-col gap-3 mt-3">
                      <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Top Pinned Projects</span>
                      {github.top_projects.map((repo, idx) => (
                        <div key={idx} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20 hover:border-primary/30 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <a href={repo.url} target="_blank" rel="noreferrer" className="font-bold text-on-surface hover:text-primary transition-colors text-sm truncate max-w-[140px]">{repo.name}</a>
                            <div className="flex gap-2 text-xs font-medium text-on-surface-variant bg-white px-2 py-1 rounded-md shadow-sm border border-outline-variant/10">
                              <span>⭐ {repo.stars}</span>
                              <span>🍴 {repo.forks}</span>
                            </div>
                          </div>
                          {repo.description && (
                            <p className="m-0 text-xs text-on-surface-variant truncate">
                              {repo.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {github?.quick_fixes && github.quick_fixes.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-3">
                      <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Quick Fixes</span>
                      <ul className="list-disc ml-4 text-sm text-on-surface-variant leading-relaxed space-y-1">
                        {github.quick_fixes.map((fix, idx) => <li key={idx}>{fix}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;

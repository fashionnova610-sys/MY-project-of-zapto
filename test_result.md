#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Rebrand existing cinematic landing page from Spider-Man theme to Zaptopay crypto exchange platform while maintaining scroll-choreographed structure and animations"

frontend:
  - task: "Update global styling to Zaptopay brand (Space Grotesk font, dark mode, glassmorphism)"
    implemented: true
    working: "NA"
    file: "frontend/src/index.css, frontend/tailwind.config.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Added Space Grotesk font, Zaptopay brand colors (vault-navy, charcoal, zap-green, electric-blue), glassmorphism utilities, and dark mode background (#0a0e27)"

  - task: "Rebrand Navigation component with Zaptopay logo and WhatsApp integration"
    implemented: true
    working: "NA"
    file: "frontend/src/components/Navigation.js, frontend/src/components/Navigation.css"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Replaced Daily Bugle logo with Zaptopay logo, updated nav items (RATES, HOW IT WORKS, SECURITY, CONTACT), added WhatsApp button with pre-filled message, applied glassmorphic styling with green accents"

  - task: "Transform GenreTags to feature badges (INSTANT, SECURE, 24/7)"
    implemented: true
    working: "NA"
    file: "frontend/src/components/GenreTags.js, frontend/src/components/GenreTags.css"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Replaced movie genres with crypto exchange features, added icons, applied glassmorphic pill design with green glow effects"

  - task: "Rebrand MainTitle to Zaptopay hero with rates display and WhatsApp CTA"
    implemented: true
    working: "NA"
    file: "frontend/src/components/MainTitle.js, frontend/src/components/MainTitle.css"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Replaced SPIDERMAN title with ZAPTOPAY, added hero subtitle 'Trade Crypto. Instant XAF. Zero Fear.', implemented rate display (YOU SELL: 573 XAF/$, YOU BUY: 598 XAF/$), added WhatsApp CTA button, replaced Spider-Man image with crypto icons in scroller, applied gradient glow effects"

  - task: "Create floating WhatsApp button with pulse animation"
    implemented: true
    working: "NA"
    file: "frontend/src/components/FloatingWhatsApp.js, frontend/src/components/FloatingWhatsApp.css"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Created fixed bottom-right WhatsApp button with gradient background, pulse ring animation, appears after scrolling 300px, opens WhatsApp with pre-filled Zaptopay message"

metadata:
  created_by: "main_agent"
  version: "2.0"
  test_sequence: 2
  run_ui: true

test_plan:
  current_focus:
    - "Visual verification of Zaptopay branding (logo, colors, typography)"
    - "Test WhatsApp integration (navigation button, hero CTA, floating button)"
    - "Verify rate display visibility and styling"
    - "Check responsive design on mobile"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Phase 1 complete: Hero section rebranded to Zaptopay with dark mode + glassmorphism. Logo integrated, WhatsApp CTAs functional, rate display implemented. Next: rebrand remaining sections (ReferenceSection, ReferenceDetailsSection, etc.). Need visual verification before proceeding."

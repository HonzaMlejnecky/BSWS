package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.HostingPlanDTO;
import cz.hostingcentrum.Model.HostingPlan;
import cz.hostingcentrum.Repository.HostingPlanRepo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/plans")
@RequiredArgsConstructor
@Tag(name = "Hosting Plans", description = "Hosting plans management")
public class PlanController {

    private static final Logger log = LoggerFactory.getLogger(PlanController.class);
    private final HostingPlanRepo hostingPlanRepo;

    @GetMapping
    @Operation(
            summary = "List all active plans",
            description = "Returns list of all active hosting plans sorted by display order."
    )
    public ResponseEntity<List<HostingPlanDTO>> getAllPlans() {
        log.debug("Fetching all active hosting plans");
        List<HostingPlan> plans = hostingPlanRepo.findByIsActiveTrueOrderByDisplayOrderAsc();
        List<HostingPlanDTO> dtos = plans.stream()
                .map(this::toDTO)
                .toList();
        log.info("Returning {} hosting plans", dtos.size());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Get plan by ID",
            description = "Returns details of a specific hosting plan by ID."
    )
    public ResponseEntity<HostingPlanDTO> getPlanById(@PathVariable Long id) {
        log.debug("Fetching hosting plan with id: {}", id);
        return hostingPlanRepo.findById(id)
                .map(plan -> {
                    log.info("Found hosting plan: {}", plan.getCode());
                    return ResponseEntity.ok(toDTO(plan));
                })
                .orElseGet(() -> {
                    log.warn("Hosting plan not found: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/code/{code}")
    @Operation(
            summary = "Get plan by code",
            description = "Returns details of a specific hosting plan by code (basic, premium, business)."
    )
    public ResponseEntity<HostingPlanDTO> getPlanByCode(@PathVariable String code) {
        log.debug("Fetching hosting plan with code: {}", code);
        return hostingPlanRepo.findByCode(code)
                .map(plan -> {
                    log.info("Found hosting plan: {}", plan.getName());
                    return ResponseEntity.ok(toDTO(plan));
                })
                .orElseGet(() -> {
                    log.warn("Hosting plan not found with code: {}", code);
                    return ResponseEntity.notFound().build();
                });
    }

    private HostingPlanDTO toDTO(HostingPlan plan) {
        HostingPlanDTO dto = new HostingPlanDTO();
        dto.setId(plan.getId());
        dto.setCode(plan.getCode());
        dto.setName(plan.getName());
        dto.setDescription(plan.getDescription());
        dto.setDiskSpaceMb(plan.getDiskSpaceMb());
        dto.setBandwidthMb(plan.getBandwidthMb());
        dto.setMaxDomains(plan.getMaxDomains());
        dto.setMaxDatabases(plan.getMaxDatabases());
        dto.setMaxFtpAccounts(plan.getMaxFtpAccounts());
        dto.setMaxEmailAccounts(plan.getMaxEmailAccounts());
        dto.setPriceMonthly(plan.getPriceMonthly());
        dto.setPriceYearly(plan.getPriceYearly());
        return dto;
    }
}
